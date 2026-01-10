<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import Icon from "@iconify/svelte";

  // --- Interfaces ---
  interface Artist {
    name: string;
    url: string;
  }

  interface Track {
    name: string;
    artists: Artist[];
    albumArt: string;
    url: string;
    playedAt: string;
  }

  interface NowPlayingData {
    IsUserListeningToSomething: boolean;
    NowPlayingArtists?: Artist[];
    NowPlayingAlbum?: string;
    NowPlayingAlbumArt?: string;
    NowPlayingName?: string;
    NowPlayingUrl?: string;
    NowPlayingDuration?: number;
    NowPlayingProgress?: number;
    recentTracks?: Track[];
    error?: string;
    NowPlayingAlbumUrl?: string;
  }

  // --- Props ---
  let { translations, defaultTranslations } = $props<{
    translations: Record<string, any>;
    defaultTranslations: Record<string, any>;
  }>();

  // --- State ---
  let nowPlaying = $state<NowPlayingData | null>(null);
  let isLoading = $state(true);
  let isDropdownOpen = $state(false);
  let error = $state<string | null>(null);
  let currentProgressMs = $state(0);

  // --- Derived ---
  let isPlaying = $derived(nowPlaying?.IsUserListeningToSomething ?? false);
  let songDuration = $derived(nowPlaying?.NowPlayingDuration ?? 0);
  let progressPercentage = $derived(
    songDuration > 0 ? (currentProgressMs / songDuration) * 100 : 0
  );

  // --- Internal ---
  const POLLING_RATE_MS = 15000;
  let pollingInterval: number | null = null;
  let progressAnimationId: number | null = null;
  let lastProgressUpdateTime = 0;

  // --- Helpers ---
  function getNestedValue(obj: any, path: string): string | undefined {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  function t(key: string): string {
    return (
      getNestedValue(translations, key) ??
      getNestedValue(defaultTranslations, key) ??
      key
    );
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const showToast = (message: string, duration = 5000) => {
    error = message;
    setTimeout(() => (error = null), duration);
  };

  function stopProgressAnimation() {
    if (progressAnimationId) {
      cancelAnimationFrame(progressAnimationId);
      progressAnimationId = null;
    }
  }

  function startProgressAnimation(startProgress: number, duration: number) {
    stopProgressAnimation();
    if (duration <= 0) return;

    let progress = startProgress;
    lastProgressUpdateTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastProgressUpdateTime;
      lastProgressUpdateTime = currentTime;

      // Only advance progress if valid
      if (isPlaying) {
        progress += deltaTime;
      }

      if (progress >= duration) {
        currentProgressMs = duration;
        return; // Ended
      }

      currentProgressMs = progress;
      progressAnimationId = requestAnimationFrame(animate);
    };
    progressAnimationId = requestAnimationFrame(animate);
  }

  async function fetchNowPlayingData() {
    try {
      const response = await fetch("/api/spotifynowplaying.json");
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data: NowPlayingData = await response.json();
      nowPlaying = data;

      if (
        data.IsUserListeningToSomething &&
        data.NowPlayingDuration &&
        data.NowPlayingProgress
      ) {
        startProgressAnimation(data.NowPlayingProgress, data.NowPlayingDuration);
      } else {
        stopProgressAnimation();
      }
    } catch (err: any) {
      console.error(err);
      showToast("Failed to fetch Spotify data.");
      nowPlaying = { IsUserListeningToSomething: false };
      stopPolling();
    } finally {
      isLoading = false;
    }
  }

  function startPolling() {
    stopPolling();
    fetchNowPlayingData();
    pollingInterval = setInterval(
      fetchNowPlayingData,
      POLLING_RATE_MS
    ) as unknown as number;
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    stopProgressAnimation();
  }

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function handleClickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (
        node &&
        !node.contains(event.target as Node) &&
        !event.defaultPrevented
      ) {
        isDropdownOpen = false;
      }
    };
    document.addEventListener("click", handleClick, true);
    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }

  // --- Effects ---
  $effect(() => {
    if (isDropdownOpen) {
      startPolling();
    } else {
      stopPolling();
    }
  });

  // Initial fetch (once)
  onMount(() => {
    fetchNowPlayingData();
  });

  onDestroy(() => {
    stopPolling();
  });
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end" use:handleClickOutside>
  <!-- Toast Notif -->
  {#if error}
    <div transition:fly={{ y: 20, duration: 300 }} class="toast toast-bottom toast-end z-50 mb-20 mr-0">
      <div class="alert alert-error shadow-xl rounded-xl">
        <Icon icon="material-symbols:error-rounded" class="text-xl" />
        <span>{error}</span>
      </div>
    </div>
  {/if}

  <!-- Dropdown Content -->
  {#if isDropdownOpen}
    <div
      transition:fly={{ y: 10, duration: 250, opacity: 0 }}
      id="now-playing-dropdown"
      class="mb-4 w-96 max-w-[calc(100vw-3rem)] origin-bottom-right"
      role="dialog"
      aria-labelledby="now-playing-title"
    >
      <div class="card bg-base-100/95 backdrop-blur-xl shadow-2xl border border-white/5 overflow-hidden">
        <!-- Loading State -->
        {#if isLoading && !nowPlaying}
          <div class="card-body p-5">
            <div class="skeleton h-6 w-32 mb-4 bg-base-300/50"></div>
            <div class="flex items-center gap-4">
              <div class="skeleton w-20 h-20 shrink-0 rounded-lg bg-base-300/50"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton h-5 w-3/4 bg-base-300/50"></div>
                <div class="skeleton h-4 w-1/2 bg-base-300/50"></div>
              </div>
            </div>
          </div>
        <!-- Playing State -->
        {:else if isPlaying && nowPlaying}
          <div class="relative">
            <!-- Background blur effect from album art -->
            <div 
              class="absolute inset-0 opacity-10 blur-3xl pointer-events-none"
              style="background-image: url('{nowPlaying.NowPlayingAlbumArt}'); background-size: cover; background-position: center;"
            ></div>
            
            <div class="card-body p-5 relative z-10">
              <div class="flex items-start justify-between mb-3">
                <h2 class="text-sm font-bold uppercase tracking-wider opacity-70 flex items-center gap-2" id="now-playing-title">
                  <Icon icon="svg-spinners:bars-scale-middle" class="text-accent" />
                  {t("nowPlaying.title")}
                </h2>
                <a 
                   href={nowPlaying.NowPlayingUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="btn btn-xs btn-ghost btn-circle opacity-50 hover:opacity-100"
                   aria-label="Open in Spotify"
                >
                  <Icon icon="mdi:spotify" class="text-xl" />
                </a>
              </div>

              <div class="flex items-center gap-4 group">
                <figure class="w-20 h-20 shrink-0 relative overflow-hidden rounded-lg shadow-lg">
                   <a href={nowPlaying.NowPlayingAlbumUrl} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={nowPlaying.NowPlayingAlbumArt} 
                      alt={nowPlaying.NowPlayingAlbum} 
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                   </a>
                </figure>

                <div class="min-w-0 flex-1">
                  <div class="font-bold text-lg leading-tight truncate">
                    <a class="hover:text-accent transition-colors" href={nowPlaying.NowPlayingUrl} target="_blank">{nowPlaying.NowPlayingName}</a>
                  </div>
                  <div class="text-sm opacity-75 truncate mt-1">
                    <a class="hover:underline" href={nowPlaying.NowPlayingAlbumUrl} target="_blank">{nowPlaying.NowPlayingAlbum}</a>
                  </div>
                  <div class="text-xs opacity-60 truncate mt-0.5">
                    {#each nowPlaying.NowPlayingArtists ?? [] as artist, i}
                      <a class="hover:text-accent transition-colors" href={artist.url} target="_blank">{artist.name}</a>
                      {#if i < (nowPlaying.NowPlayingArtists?.length ?? 0) - 1}, {/if}
                    {/each}
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4 space-y-1">
                <div class="w-full bg-base-content/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    class="bg-accent h-full rounded-full transition-all duration-300 ease-linear" 
                    style="width: {progressPercentage}%"
                  ></div>
                </div>
                <div class="flex justify-between text-[10px] font-medium opacity-50 font-mono">
                  <span>{formatTime(currentProgressMs)}</span>
                  <span>{formatTime(songDuration)}</span>
                </div>
              </div>

              <!-- Recent Tracks (Mini) -->
              {#if nowPlaying.recentTracks && nowPlaying.recentTracks.length > 0}
                 <div class="divider my-2 opacity-10"></div>
                 <div class="space-y-2">
                    <p class="text-xs font-bold opacity-50 uppercase tracking-widest">{t("nowPlaying.lastPlayedText")}</p>
                    {#each nowPlaying.recentTracks.slice(0, 2) as track}
                      <a href={track.url} target="_blank" class="flex items-center gap-2 hover:bg-white/5 p-1 rounded-lg transition-colors group/track">
                         <img src={track.albumArt} class="w-8 h-8 rounded object-cover shadow-sm grayscale group-hover/track:grayscale-0 transition-all" alt={track.name}/>
                         <div class="min-w-0 overflow-hidden">
                            <div class="text-xs font-semibold truncate group-hover/track:text-accent transition-colors">{track.name}</div>
                            <div class="text-[10px] opacity-60 truncate">
                              {#each track.artists as artist, j}{artist.name}{#if j < track.artists.length - 1}, {/if}{/each}
                            </div>
                         </div>
                      </a>
                    {/each}
                 </div>
              {/if}
            </div>
          </div>
        
        <!-- Not Playing State -->
        {:else}
          <div class="card-body p-5">
            <h2 class="font-bold text-lg mb-2 flex items-center gap-2">
              <Icon icon="material-symbols:music-off-rounded" class="opacity-50" />
              {t("nowPlaying.notPlayingSomethingText")}
            </h2>
            
            {#if nowPlaying?.recentTracks && nowPlaying.recentTracks.length > 0}
               <div class="space-y-3 mt-2">
                  <p class="text-xs font-bold opacity-50 uppercase tracking-widest">{t("nowPlaying.lastPlayedText")}</p>
                  {#each nowPlaying.recentTracks.slice(0, 4) as track}
                    <div class="flex items-center gap-3">
                       <img src={track.albumArt} class="w-10 h-10 rounded-md object-cover shadow-sm opacity-80" alt={track.name}/>
                       <div class="min-w-0 flex-1">
                          <a href={track.url} target="_blank" class="text-sm font-semibold hover:text-accent truncate block">{track.name}</a>
                          <div class="text-xs opacity-60 truncate">
                             {#each track.artists as artist, j}{artist.name}{#if j < track.artists.length - 1}, {/if}{/each}
                          </div>
                       </div>
                    </div>
                  {/each}
               </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Main Toggle Button -->
  <button
    class="btn btn-circle btn-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative border-4 border-base-100
    {isPlaying ? 'dancing bg-accent hover:bg-accent-focus text-accent-content' : 'bg-base-200 text-base-content'}"
    onclick={toggleDropdown}
    aria-expanded={isDropdownOpen}
    aria-label="Toggle Now Playing"
  >
    {#if isLoading && nowPlaying === null}
      <span class="loading loading-spinner loading-md"></span>
    {:else}
      <Icon class="text-3xl" icon="material-symbols:music-cast-rounded" />
    {/if}
    
    {#if isPlaying}
      <span class="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-base-100 animate-pulse"></span>
    {/if}
  </button>
</div>

<style>
  @keyframes dance {
    0%,
    100% {
      transform: translateY(0) rotate(0);
    }
    33% {
      transform: translateY(-4px) rotate(-3deg);
    }
    66% {
      transform: translateY(2px) rotate(3deg);
    }
  }

  .dancing {
    animation: dance 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
</style>
