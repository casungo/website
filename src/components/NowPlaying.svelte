<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount, onDestroy } from "svelte";
  import { t } from "i18n:astro";
  import Icon from "@iconify/svelte";

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

  const nowPlaying = writable<NowPlayingData | null>(null);
  const isLoading = writable(true); // Start as true on initial load
  const isDropdownOpen = writable(false);
  const error = writable<string | null>(null);

  let pollingInterval: ReturnType<typeof setInterval> | null = null;
  const POLLING_RATE_MS = 15000; // Poll every 15 seconds when open

  let progressAnimationId: number | null = null;
  let currentProgressMs = writable(0);
  let lastProgressUpdateTime = 0;

  $: isPlaying = $nowPlaying?.IsUserListeningToSomething ?? false;
  $: songDuration = $nowPlaying?.NowPlayingDuration ?? 0;

  $: progressPercentage = songDuration > 0 ? ($currentProgressMs / songDuration) * 100 : 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const showToast = (message: string, duration = 5000) => {
    error.set(message);
    setTimeout(() => error.set(null), duration);
  };

  const stopProgressAnimation = () => {
    if (progressAnimationId) {
      cancelAnimationFrame(progressAnimationId);
      progressAnimationId = null;
    }
  };

  const startProgressAnimation = (startProgress: number, duration: number) => {
    stopProgressAnimation();
    if (duration <= 0) return;

    let progress = startProgress;
    lastProgressUpdateTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastProgressUpdateTime;
      lastProgressUpdateTime = currentTime;
      progress += deltaTime;

      if (progress >= duration) {
        currentProgressMs.set(duration);
        // Song has ended, next poll will fetch the new song
        return;
      }

      currentProgressMs.set(progress);
      progressAnimationId = requestAnimationFrame(animate);
    };
    progressAnimationId = requestAnimationFrame(animate);
  };

  const fetchNowPlayingData = async () => {
    try {
      const response = await fetch("/api/spotifynowplaying.json");
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data: NowPlayingData = await response.json();
      nowPlaying.set(data);

      if (data.IsUserListeningToSomething && data.NowPlayingDuration && data.NowPlayingProgress) {
        startProgressAnimation(data.NowPlayingProgress, data.NowPlayingDuration);
      } else {
        stopProgressAnimation();
      }
    } catch (err: any) {
      showToast("Failed to fetch Spotify data.");
      nowPlaying.set({ IsUserListeningToSomething: false }); // Set a default state on error
      stopPolling();
    } finally {
      isLoading.set(false);
    }
  };

  const startPolling = () => {
    stopPolling(); // Ensure no multiple intervals running
    fetchNowPlayingData(); // Fetch immediately
    pollingInterval = setInterval(fetchNowPlayingData, POLLING_RATE_MS);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    stopProgressAnimation();
  };

  const toggleDropdown = () => {
    isDropdownOpen.update((open) => !open);
  };

  const handleClickOutside = (node: HTMLElement) => {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
        isDropdownOpen.set(false);
      }
    };
    document.addEventListener("click", handleClick, true);
    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };

  // Subscribe to dropdown state to manage polling
  isDropdownOpen.subscribe((open) => {
    if (open) {
      startPolling();
    } else {
      stopPolling();
    }
  });

  onMount(() => {
    // Fetch initial state without starting polling
    fetchNowPlayingData();
  });

  onDestroy(() => {
    stopPolling(); // Cleanup on component destruction
  });
</script>

<div class="fixed bottom-0 right-0 z-10" use:handleClickOutside>
  {#if $error}
    <div class="toast toast-bottom toast-end">
      <div class="alert alert-error">
        <span>{$error}</span>
      </div>
    </div>
  {/if}
  <button
    class="btn mb-4 mr-4 btn-accent shadow-lg hover:shadow-xl transition-all duration-200 relative {isPlaying ? 'dancing' : ''}"
    on:click={toggleDropdown}
    aria-expanded={$isDropdownOpen}
    aria-controls="now-playing-dropdown"
    aria-label="Now playing music information"
  >
    {#if $isLoading && $nowPlaying === null}
      <span class="loading loading-spinner"></span>
    {:else}
      <Icon class="text-2xl" icon="material-symbols:music-cast-rounded" />
    {/if}
  </button>

  {#if $isDropdownOpen}
    <div
      id="now-playing-dropdown"
      class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-20 mr-4 bg-neutral text-neutral-content rounded-lg shadow-xl w-96"
      role="dialog"
      aria-labelledby="now-playing-title"
    >
      {#if $isLoading && !$nowPlaying}
        <div class="card bg-base-100 animate-pulse">
          <div class="card-body p-4">
            <div class="skeleton h-6 w-32 mb-2"></div>
            <div class="flex items-center gap-4">
              <div class="skeleton w-24 h-24 shrink-0 rounded-lg"></div>
              <div class="w-full space-y-2">
                <div class="skeleton h-6 w-48"></div>
                <div class="skeleton h-4 w-32"></div>
              </div>
            </div>
          </div>
        </div>
      {:else if isPlaying && $nowPlaying}
        <div class="card bg-base-100">
          <div class="card-body p-4">
            <h2 class="card-title text-lg font-bold mb-2" id="now-playing-title">{t("nowPlaying.title")}</h2>
            <div class="flex items-center gap-4">
              <figure class="w-24 h-24 shrink-0">
                <a href={$nowPlaying.NowPlayingAlbumUrl} target="_blank" rel="noopener noreferrer" class="block">
                  <img src={$nowPlaying.NowPlayingAlbumArt} alt="Album Art for {$nowPlaying.NowPlayingAlbum}" class="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity" />
                </a>
              </figure>
              <div class="min-w-0 flex-auto space-y-1">
                <div class="text-lg font-semibold line-clamp-2 break-words">
                  <a class="hover:text-primary" href={$nowPlaying.NowPlayingUrl}>{$nowPlaying.NowPlayingName}</a>
                </div>
                <div class="text-sm text-base-content/70">
                  <a class="hover:text-primary" href={$nowPlaying.NowPlayingAlbumUrl}>{$nowPlaying.NowPlayingAlbum}</a>
                </div>
                <div class="flex flex-wrap items-center gap-x-1 text-sm text-base-content/70">
                  {#each $nowPlaying.NowPlayingArtists ?? [] as artist: Artist, i}
                    <a class="hover:text-primary" href={artist.url} target="_blank" rel="noopener noreferrer">{artist.name}</a>
                    {#if i < ($nowPlaying.NowPlayingArtists?.length ?? 0) - 1}<span class="text-base-content/50">,</span>{/if}
                  {/each}
                </div>
              </div>
            </div>
            <div class="w-full bg-base-300 rounded-full h-1.5 mt-4">
              <div class="bg-accent h-1.5 rounded-full" style="width: {progressPercentage}%"></div>
            </div>
            <div class="flex justify-between text-xs text-base-content/60 mt-1">
              <span>{formatTime($currentProgressMs)}</span>
              <span>{formatTime(songDuration)}</span>
            </div>
            {#if $nowPlaying?.recentTracks && $nowPlaying.recentTracks.length > 0}
              <div class="mt-2">
                <p class="text-sm text-base-content/70 mb-2">{t("nowPlaying.lastPlayedText")}</p>
                {#each $nowPlaying.recentTracks.slice(0, 2) as track, i}
                  <div class="flex items-center gap-2 mb-2 transition-opacity" style="opacity: {0.9 - i * 0.4};">
                    <img src={track.albumArt} alt="Album art for {track.name}" class="w-8 h-8 rounded-md object-cover" />
                    <div class="min-w-0">
                      <div class="text-sm font-medium line-clamp-1">
                        <a class="hover:text-primary" href={track.url}>{track.name}</a>
                      </div>
                      <div class="text-xs text-base-content/70 truncate">
                        {#each track.artists as artist, j}
                          <a class="hover:text-primary" href={artist.url}>{artist.name}</a>
                          {#if j < track.artists.length - 1},
                          {/if}
                        {/each}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <div class="card bg-base-100">
          <div class="card-body p-4">
            <h2 class="card-title text-lg font-bold mb-2">{t("nowPlaying.notPlayingSomethingText")}</h2>
            {#if $nowPlaying?.recentTracks && $nowPlaying.recentTracks.length > 0}
              <div class="mt-2">
                <p class="text-sm text-base-content/70 mb-2">{t("nowPlaying.lastPlayedText")}</p>
                {#each $nowPlaying.recentTracks.slice(0, 5) as track, i}
                  <div class="flex items-center gap-2 mb-2 transition-opacity" style="opacity: {1 - i * 0.2};">
                    <img src={track.albumArt} alt="Album art for {track.name}" class="w-8 h-8 rounded-md object-cover" />
                    <div class="min-w-0">
                      <div class="text-sm font-medium line-clamp-1">
                        <a class="hover:text-primary" href={track.url}>{track.name}</a>
                      </div>
                      <div class="text-xs text-base-content/70 truncate">
                        {#each track.artists as artist, j}
                          <a class="hover:text-primary" href={artist.url}>{artist.name}</a>
                          {#if j < track.artists.length - 1},
                          {/if}
                        {/each}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  @keyframes dance {
    0%,
    100% {
      transform: translateY(0) rotate(0);
    }
    33% {
      transform: translateY(-3px) rotate(-1deg);
    }
    66% {
      transform: translateY(2px) rotate(1deg);
    }
  }

  .dancing {
    animation: dance 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
</style>
