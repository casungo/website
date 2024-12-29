<script>
  import { writable } from "svelte/store";
  import { t } from "i18n:astro";
  import Icon from "@iconify/svelte";

  const nowPlaying = writable(null);
  const isLoading = writable(false);
  const isDropdownOpen = writable(false);

  async function fetchNowPlayingData() {
    isLoading.set(true);
    try {
      const response = await fetch(`/api/lastfmnowlistening.json`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      nowPlaying.set(data);
    } catch (error) {
      console.error("Error fetching now playing data:", error);
      nowPlaying.set({ IsUserListeningToSomething: false });
    } finally {
      isLoading.set(false);
    }
  }

  function handleButtonClick() {
    if ($isDropdownOpen) {
      isDropdownOpen.set(false);
    } else {
      fetchNowPlayingData();
      isDropdownOpen.set(true);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      handleButtonClick();
    }
  }
</script>

<div class="fixed bottom-0 right-0 z-10">
  <div tabindex="0" role="button" class="btn mb-4 mr-4 btn-accent shadow-lg hover:shadow-xl transition-all duration-200" on:click={handleButtonClick} on:keydown={handleKeyDown}>
    <Icon class="text-2xl" icon="material-symbols:music-cast-rounded" />
  </div>
  {#if $isDropdownOpen}
    {#if $isLoading}
      <div tabindex="-1" class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 mr-4 bg-neutral text-neutral-content p-4 rounded-lg shadow-xl">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if $nowPlaying && $nowPlaying.IsUserListeningToSomething}
      <div tabindex="-1" class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 bg-neutral text-neutral-content mr-4 rounded-lg shadow-xl overflow-hidden">
        <div class="w-96">
          <div class="card bg-base-100">
            <div class="card-body p-4">
              <h2 class="card-title text-lg font-bold mb-2">{t("nowPlaying.title")}</h2>
              <div class="flex items-center gap-4">
                <figure class="w-24 h-24 shrink-0">
                  <img src={$nowPlaying.NowPlayingAlbumArt} alt="Album Art" class="rounded-lg object-cover w-full h-full" />
                </figure>
                <div class="min-w-0 flex-auto space-y-1">
                  <div class="text-lg font-semibold truncate">
                    <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.NowPlayingUrl}>
                      {$nowPlaying.NowPlayingName}
                    </a>
                  </div>
                  <div class="text-sm text-neutral-500 truncate">
                    <a class="hover:text-primary transition-colors duration-200" href={`https://www.last.fm/music/${encodeURIComponent($nowPlaying.NowPlayingArtist)}`}>
                      {$nowPlaying.NowPlayingArtist}
                    </a>
                  </div>
                </div>
              </div>
              {#if $nowPlaying.LastPlayedName}
                <div class="mt-4 border-t border-neutral-700 pt-2">
                  <p class="text-sm text-neutral-500">{t("nowPlaying.lastPlayedText")}</p>
                  <div class="text-sm truncate">
                    <a class="hover:text-primary transition-colors duration-200" href={$nowPlaying.LastPlayedUrl}>{$nowPlaying.LastPlayedName}</a>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
        {#if $nowPlaying.IsUserListeningToSomething === false && $nowPlaying.LastPlayedDate}
          <div class="card-body p-4 text-sm">{t("nowPlaying.lastPlayedText")} {$nowPlaying.LastPlayedDate}</div>
        {/if}
      </div>
    {:else}
      <div tabindex="-1" class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 bg-neutral text-neutral-content mr-4 w-64 rounded-lg shadow-xl">
        <div class="card-body p-4 text-sm">
          {t("nowPlaying.notPlayingSomethingText")}
        </div>
      </div>
    {/if}
  {/if}
</div>
