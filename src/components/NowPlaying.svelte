<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount, onDestroy } from "svelte";
  import { t } from "i18n:astro";
  import Icon from "@iconify/svelte";

  interface Track {
    name: string;
    artists: Artist[]; // Changed from single string
    albumArt: string;
    url: string;
    playedAt: string;
  }

  interface Artist {
    name: string;
    url: string;
  }

  interface NowPlayingData {
    NowPlayingArtists?: Artist[];
    NowPlayingAlbum?: string;
    NowPlayingAlbumArt?: string;
    NowPlayingName?: string;
    NowPlayingUrl?: string;
    NowPlayingDuration?: number;
    NowPlayingProgress?: number;
    recentTracks?: Track[];
    IsUserListeningToSomething: boolean;
    error?: string;
    errorMessage?: string;
    NowPlayingAlbumUrl?: string;
  }

  const nowPlaying = writable<NowPlayingData | null>(null);
  const isLoading = writable(false);
  const isDropdownOpen = writable(false);
  const error = writable<string | null>(null);
  const progressPercentage = writable(0);
  const currentProgress = writable(0);

  let toastTimeout: NodeJS.Timeout | null = null;
  let retryCount = 0;
  let lastFetchTime = 0;
  let isFetching = false;
  let refreshInterval: NodeJS.Timeout | null = null;
  let progressInterval: NodeJS.Timeout | null = null;

  const MAX_RETRIES = 3;
  const CACHE_DURATION = 10000;
  const DEFAULT_REFRESH_INTERVAL = 30000;

  const showToast = (message: string, duration = 5000) => {
    error.set(message);
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => error.set(null), duration);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const updateProgressBar = (duration: number, progress: number) => {
    if (progressInterval) clearInterval(progressInterval);

    if (!duration || !progress) {
      progressPercentage.set(0);
      currentProgress.set(0);
      return;
    }

    let progressMs = progress;
    progressPercentage.set((progressMs / duration) * 100);
    currentProgress.set(progressMs);

    progressInterval = setInterval(() => {
      progressMs += 1000;
      if (progressMs >= duration) {
        if (progressInterval) clearInterval(progressInterval);
        setTimeout(fetchNowPlayingData, 2000);
      } else {
        progressPercentage.set((progressMs / duration) * 100);
        currentProgress.set(progressMs);
      }
    }, 1000);
  };

  const calculateRefreshInterval = (duration: number | null) => (duration ? Math.max(10000, Math.min(60000, duration / 10)) : DEFAULT_REFRESH_INTERVAL);

  const startAutoRefresh = (duration: number | null) => {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(fetchNowPlayingData, calculateRefreshInterval(duration));
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  };

  const fetchNowPlayingData = async () => {
    if (isFetching || Date.now() - lastFetchTime < CACHE_DURATION) return;

    isLoading.set(true);
    error.set(null);
    isFetching = true;

    try {
      const response = await fetch("/api/spotifynowplaying.json");
      lastFetchTime = Date.now();
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      nowPlaying.set(data);

      if (data.IsUserListeningToSomething && data.NowPlayingDuration && data.NowPlayingProgress) {
        updateProgressBar(data.NowPlayingDuration, data.NowPlayingProgress);
      }

      startAutoRefresh(data.NowPlayingDuration);
      retryCount = 0;
    } catch (err: any) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(fetchNowPlayingData, Math.min(1000 * 2 ** retryCount, 30000));
      } else {
        showToast("Failed to fetch data. Please try again later.");
        nowPlaying.set({ IsUserListeningToSomething: false });
        stopAutoRefresh();
      }
    } finally {
      isLoading.set(false);
      isFetching = false;
    }
  };

  const toggleDropdown = () => {
    isDropdownOpen.update((open) => {
      if (!open) fetchNowPlayingData();
      else stopAutoRefresh();
      return !open;
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === "Escape" && $isDropdownOpen) {
      isDropdownOpen.set(false);
      stopAutoRefresh();
    }
  };

  onMount(() => fetchNowPlayingData());
  onDestroy(stopAutoRefresh);
</script>

<div class="fixed bottom-0 right-0 z-10">
  {#if $error}
    <div class="toast toast-bottom toast-end">
      <div class="alert alert-error">
        <span>{$error}</span>
      </div>
    </div>
  {/if}
  <button
    class="btn mb-4 mr-4 btn-accent shadow-lg hover:shadow-xl transition-all duration-200 relative"
    on:click={toggleDropdown}
    on:keydown={handleKeyDown}
    disabled={$isLoading}
    aria-expanded={$isDropdownOpen}
    aria-controls="now-playing-dropdown"
    aria-label="Now playing music information"
  >
    {#if $isLoading}
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
    {:else}
      <Icon class="text-2xl" icon="material-symbols:music-cast-rounded" />
    {/if}
  </button>

  {#if $isDropdownOpen}
    <div
      id="now-playing-dropdown"
      class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-20 mr-4 bg-neutral text-neutral-content rounded-lg shadow-xl"
      role="dialog"
      aria-labelledby="now-playing-title"
      tabindex="-1"
      class:w-96={$nowPlaying?.IsUserListeningToSomething || ($nowPlaying?.recentTracks && $nowPlaying.recentTracks.length > 0)}
      class:w-64={!$nowPlaying?.IsUserListeningToSomething && (!$nowPlaying?.recentTracks || $nowPlaying.recentTracks.length === 0)}
    >
      {#if $isLoading && !$nowPlaying}
        <div class="card bg-base-100">
          <div class="card-body p-4">
            <h2 class="card-title text-lg font-bold mb-2">
              <span class="sr-only">Loading...</span>
              <div class="skeleton h-6 w-32" aria-hidden="true"></div>
            </h2>
            <div class="flex items-center gap-4">
              <figure class="w-24 h-24 shrink-0">
                <div class="skeleton w-full h-full rounded-lg"></div>
              </figure>
              <div class="min-w-0 flex-auto space-y-1">
                <div class="skeleton h-6 w-48"></div>
                <div class="skeleton h-4 w-32"></div>
              </div>
            </div>
          </div>
        </div>
      {:else if $nowPlaying?.IsUserListeningToSomething}
        <div class="card bg-base-100">
          <div class="card-body p-4">
            <h2 class="card-title text-lg font-bold mb-2">{t("nowPlaying.title")}</h2>
            <div class="flex items-center gap-4">
              <figure class="w-24 h-24 shrink-0">
                <a href={$nowPlaying.NowPlayingAlbumUrl} target="_blank" rel="noopener noreferrer" class="block">
                  <img src={$nowPlaying.NowPlayingAlbumArt} alt="Album Art" class="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity duration-200" />
                </a>
              </figure>
              <div class="min-w-0 flex-auto space-y-1">
                <div class="text-lg font-semibold line-clamp-2 break-words">
                  <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.NowPlayingUrl}>
                    {$nowPlaying.NowPlayingName}
                  </a>
                </div>
                <div class="text-sm text-neutral-500">
                  <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.NowPlayingAlbumUrl}>
                    {$nowPlaying.NowPlayingAlbum}
                  </a>
                </div>
                <div class="flex flex-wrap items-center gap-x-1 text-sm text-neutral-500">
                  {#if $nowPlaying.NowPlayingArtists}
                    {#each $nowPlaying.NowPlayingArtists as artist, index}
                      <a class="hover:text-primary transition-colors duration-200" href={artist.url} target="_blank" rel="noopener noreferrer">{artist.name}</a>
                      {#if index < $nowPlaying.NowPlayingArtists.length - 1}<span class="text-neutral-400">,</span>{/if}
                    {/each}
                  {/if}
                </div>
              </div>
            </div>
            {#if $nowPlaying.NowPlayingDuration}
              <div class="w-full bg-neutral-700 rounded-full h-1.5 mt-4">
                <div class="bg-accent h-1.5 rounded-full" style={`width: ${$progressPercentage}%`}></div>
              </div>
              <div class="flex justify-between text-xs text-neutral-400 mt-1">
                <span>{formatTime($currentProgress)}</span>
                <span>{formatTime($nowPlaying.NowPlayingDuration)}</span>
              </div>
            {/if}

            {#if $nowPlaying.recentTracks && $nowPlaying.recentTracks.length > 0}
              <div class="mt-4 border-t border-neutral-700 pt-4">
                <p class="text-sm text-neutral-500 mb-2">{t("nowPlaying.recentlyPlayedText", "Recently Played")}</p>
                {#each $nowPlaying.recentTracks.slice(0, 3) as track, i}
                  <div
                    class="flex items-center gap-2 mb-2 transition-all duration-300
                    {i === 0 ? 'opacity-100 blur-none' : ''}
                    {i === 1 ? 'opacity-85 blur-[0.5px] saturate-50' : ''}
                    {i === 2 ? 'opacity-70 blur-[1px] saturate-0' : ''}"
                  >
                    <a href={track.url} class="block shrink-0">
                      <img src={track.albumArt} alt="Album Art" class="w-8 h-8 rounded-lg object-cover hover:opacity-80 transition-opacity duration-200" />
                    </a>
                    <div class="min-w-0">
                      <div class="text-sm font-medium line-clamp-1">
                        <a class="hover:text-primary transition-colors duration-200" href={track.url}>
                          {track.name}
                        </a>
                      </div>
                      <div class="text-xs text-neutral-500 truncate">
                        {#each track.artists as artist, index}
                          <a class="hover:text-primary transition-colors duration-200" href={artist.url} target="_blank" rel="noopener noreferrer">
                            {artist.name}
                          </a>
                          {#if index < track.artists.length - 1}<span class="text-neutral-400">,</span>{/if}
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
            <h2 class="card-title text-lg font-bold mb-2">{t("nowPlaying.notPlayingSomethingText", "Not currently playing")}</h2>

            {#if $nowPlaying?.recentTracks && $nowPlaying.recentTracks.length > 0}
              <div class="mt-2">
                <p class="text-sm text-neutral-500 mb-2">{t("nowPlaying.recentlyPlayedText", "Recently Played")}</p>
                {#each $nowPlaying.recentTracks.slice(0, 5) as track, index}
                  <div
                    class="flex items-center gap-2 mb-2 transition-opacity duration-300
                    {index === 0 ? 'opacity-100 blur-[0px] saturate-100' : ''}
                    {index === 1 ? 'opacity-85 blur-[0.25px] saturate-75' : ''}
                    {index === 2 ? 'opacity-70 blur-[0.5px] saturate-50' : ''}
                    {index === 3 ? 'opacity-55 blur-[0.75px] saturate-25' : ''}
                    {index === 4 ? 'opacity-40 blur-[1px] saturate-0' : ''}"
                  >
                    <img src={track.albumArt} alt="Album Art" class="w-8 h-8 rounded-lg object-cover" />
                    <div class="min-w-0">
                      <div class="text-sm font-medium line-clamp-1">
                        <a class="hover:text-primary transition-colors duration-200" href={track.url}>
                          {track.name}
                        </a>
                      </div>
                      <div class="text-xs text-neutral-500 truncate">
                        {#each track.artists as artist, index}
                          <a class="hover:text-primary transition-colors duration-200" href={artist.url} target="_blank" rel="noopener noreferrer">
                            {artist.name}
                          </a>
                          {#if index < track.artists.length - 1}<span class="text-neutral-400">, </span>{/if}
                        {/each}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-sm">{t("nowPlaying.noRecentTracksText", "No recent tracks found")}</p>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
