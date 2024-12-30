<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount, onDestroy } from "svelte";
  import { t } from "i18n:astro";
  import Icon from "@iconify/svelte";

  interface NowPlayingData {
    NowPlayingArtist?: string;
    NowPlayingAlbum?: string;
    NowPlayingAlbumArt?: string;
    NowPlayingName?: string;
    NowPlayingUrl?: string;
    NowPlayingDuration?: number | null;
    LastPlayedName?: string;
    LastPlayedUrl?: string;
    LastPlayedArt?: string;
    LastPlayedDate?: string;
    IsUserListeningToSomething: boolean;
    error?: string;
    errorMessage?: string;
    lastfmError?: string;
  }

  const nowPlaying = writable<NowPlayingData | null>(null);
  const isLoading = writable(false);
  const isDropdownOpen = writable(false);
  const error = writable<string | null>(null);
  
  // Toast notification
  let toastTimeout: NodeJS.Timeout | null = null;
  const showToast = (message: string, duration = 5000) => {
    error.set(message);
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => error.set(null), duration);
  };
  let retryCount = 0;
  const MAX_RETRIES = 3;
  let lastFetchTime = 0;
  const CACHE_DURATION = 10000; // 10 seconds
  let isFetching = false;

  let refreshInterval: NodeJS.Timeout | null = null;

  const calculateRefreshInterval = (duration: number | null) => {
    if (!duration) return 30000;
    return Math.max(10000, Math.min(60000, duration / 10));
  };

  const startAutoRefresh = (duration: number | null, isListening: boolean) => {
    if (refreshInterval) clearInterval(refreshInterval);
    const interval = isListening ? calculateRefreshInterval(duration) : 30000;
    refreshInterval = setInterval(fetchNowPlayingData, interval);
  };

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };

  const fetchNowPlayingData = async () => {
    if (isFetching || Date.now() - lastFetchTime < CACHE_DURATION) return;
    
    isLoading.set(true);
    error.set(null);
    isFetching = true;
    try {
      const response = await fetch("/api/lastfmnowlistening.json");
      lastFetchTime = Date.now();
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      nowPlaying.set(data);
      startAutoRefresh(data.NowPlayingDuration, data.IsUserListeningToSomething);
      retryCount = 0; // Reset retry count on success
    } catch (error: any) {
      console.error("Error fetching now playing data:", error);
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        const retryDelay = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff
        setTimeout(fetchNowPlayingData, retryDelay);
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
    if ($isDropdownOpen) {
      isDropdownOpen.set(false);
      stopAutoRefresh();
    } else {
      fetchNowPlayingData();
      isDropdownOpen.set(true);
    }
  };

  onMount(() => {
    fetchNowPlayingData();
  });

  onDestroy(() => {
    stopAutoRefresh();
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === "Escape" && $isDropdownOpen) {
      isDropdownOpen.set(false);
      stopAutoRefresh();
    }
  };
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
      class:w-96={$nowPlaying?.IsUserListeningToSomething}
      class:w-64={!$nowPlaying?.IsUserListeningToSomething}
    >
      {#if $isLoading}
        <div class="card bg-base-100">
          <div class="card-body p-4">
            <h2 class="card-title text-lg font-bold mb-2">
              <div class="skeleton h-6 w-32"></div>
            </h2>
            <div class="flex items-center gap-4">
              <figure class="w-24 h-24 shrink-0">
                <div class="skeleton w-full h-full rounded-lg"></div>
              </figure>
              <div class="min-w-0 flex-auto space-y-1">
                <div class="text-lg font-semibold line-clamp-2 break-words">
                  <div class="skeleton h-6 w-48"></div>
                </div>
                <div class="text-sm text-neutral-500 truncate">
                  <div class="skeleton h-4 w-32"></div>
                </div>
              </div>
            </div>
            <div class="mt-4 border-t border-neutral-700 pt-4">
              <div class="text-sm text-neutral-500 mb-2">
                <div class="skeleton h-4 w-24"></div>
              </div>
              <div class="flex items-center gap-2">
                <div class="skeleton w-8 h-8 rounded-lg"></div>
                <div class="text-sm line-clamp-2">
                  <div class="skeleton h-4 w-36"></div>
                </div>
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
                <a href={$nowPlaying.NowPlayingUrl} target="_blank" rel="noopener noreferrer">
                  <img src={$nowPlaying.NowPlayingAlbumArt} alt="Album Art" class="rounded-lg object-cover w-full h-full hover:opacity-80 transition-opacity duration-200" />
                </a>
              </figure>
              <div class="min-w-0 flex-auto space-y-1">
                <div class="text-lg font-semibold line-clamp-2 break-words">
                  <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.NowPlayingUrl}>
                    {$nowPlaying.NowPlayingName}
                  </a>
                </div>
                <div class="text-sm text-neutral-500 truncate">
                  <a class="hover:text-primary transition-colors duration-200" href={`https://www.last.fm/music/${encodeURIComponent($nowPlaying.NowPlayingArtist || "")}`}>
                    {$nowPlaying.NowPlayingArtist}
                  </a>
                </div>
              </div>
            </div>
            {#if $nowPlaying.NowPlayingDuration}
              <div class="w-full bg-neutral-700 rounded-full h-1.5 mt-4">
                <div class="bg-accent h-1.5 rounded-full" style={`width: ${Math.random() * 100}%`} />
              </div>
            {/if}
            {#if $nowPlaying.LastPlayedName}
              <div class="mt-4 border-t border-neutral-700 pt-4">
                <p class="text-sm text-neutral-500 mb-2">{t("nowPlaying.lastPlayedText")}</p>
                <div class="flex items-center gap-2">
                  {#if $nowPlaying.LastPlayedArt}
                    <img src={$nowPlaying.LastPlayedArt} alt="Last Played Album Art" class="w-8 h-8 rounded-lg object-cover" />
                  {/if}
                  <div class="text-sm line-clamp-2">
                    <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.LastPlayedUrl}>
                      {$nowPlaying.LastPlayedName}
                    </a>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <div class="card-body p-4 text-sm">
          {t("nowPlaying.notPlayingSomethingText")}
          {#if $nowPlaying?.LastPlayedDate}
            <div class="mt-2">{t("nowPlaying.lastPlayedText")} {$nowPlaying.LastPlayedDate}</div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
