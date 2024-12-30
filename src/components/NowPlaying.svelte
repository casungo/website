<script lang="ts">
  import { writable } from "svelte/store";
  import { t } from "i18n:astro";
  import Icon from "@iconify/svelte";

  interface NowPlayingData {
    NowPlayingArtist?: string;
    NowPlayingAlbum?: string;
    NowPlayingAlbumArt?: string;
    NowPlayingName?: string;
    NowPlayingUrl?: string;
    LastPlayedName?: string;
    LastPlayedUrl?: string;
    LastPlayedDate?: string;
    IsUserListeningToSomething: boolean;
  }

  const nowPlaying = writable<NowPlayingData | null>(null);
  const isLoading = writable(false);
  const isDropdownOpen = writable(false);

  const fetchNowPlayingData = async () => {
    isLoading.set(true);
    try {
      const response = await fetch('/api/lastfmnowlistening.json');
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      nowPlaying.set(await response.json());
    } catch (error) {
      console.error("Error fetching now playing data:", error);
      nowPlaying.set({ IsUserListeningToSomething: false });
    } finally {
      isLoading.set(false);
    }
  };

  const toggleDropdown = () => {
    if ($isDropdownOpen) {
      isDropdownOpen.set(false);
    } else {
      fetchNowPlayingData();
      isDropdownOpen.set(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (['Enter', ' '].includes(event.key)) toggleDropdown();
  };
</script>

<div class="fixed bottom-0 right-0 z-10">
  <button
    class="btn mb-4 mr-4 btn-accent shadow-lg hover:shadow-xl transition-all duration-200"
    on:click={toggleDropdown}
    on:keydown={handleKeyDown}
  >
    <Icon class="text-2xl" icon="material-symbols:music-cast-rounded" />
  </button>

  {#if $isDropdownOpen}
    <div
      class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 mr-4 bg-neutral text-neutral-content rounded-lg shadow-xl"
      class:w-96={$nowPlaying?.IsUserListeningToSomething}
      class:w-64={!$nowPlaying?.IsUserListeningToSomething}
    >
      {#if $isLoading}
        <div class="p-4">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      {:else if $nowPlaying?.IsUserListeningToSomething}
        <div class="card bg-base-100">
          <div class="card-body p-4">
            <h2 class="card-title text-lg font-bold mb-2">{t("nowPlaying.title")}</h2>
            <div class="flex items-center gap-4">
              <figure class="w-24 h-24 shrink-0">
                <img
                  src={$nowPlaying.NowPlayingAlbumArt}
                  alt="Album Art"
                  class="rounded-lg object-cover w-full h-full"
                />
              </figure>
              <div class="min-w-0 flex-auto space-y-1">
                <div class="text-lg font-semibold truncate">
                  <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.NowPlayingUrl}>
                    {$nowPlaying.NowPlayingName}
                  </a>
                </div>
                <div class="text-sm text-neutral-500 truncate">
                  <a class="hover:text-primary transition-colors duration-200" 
                     href={`https://www.last.fm/music/${encodeURIComponent($nowPlaying.NowPlayingArtist || '')}`}>
                    {$nowPlaying.NowPlayingArtist}
                  </a>
                </div>
              </div>
            </div>
            {#if $nowPlaying.LastPlayedName}
              <div class="mt-4 border-t border-neutral-700 pt-2">
                <p class="text-sm text-neutral-500">{t("nowPlaying.lastPlayedText")}</p>
                <div class="text-sm truncate">
                  <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.LastPlayedUrl}>
                    {$nowPlaying.LastPlayedName}
                  </a>
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
