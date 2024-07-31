<script>
  import { writable } from "svelte/store";
  import { t } from "i18n:astro";

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
  <div tabindex="0" role="button" class="btn mb-4 mr-4" on:click={handleButtonClick} on:keydown={handleKeyDown}>Click</div>
  {#if $isDropdownOpen}
    {#if $isLoading}
      <div tabindex="-1" class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 mr-4 bg-neutral text-neutral-content p-4">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if $nowPlaying && $nowPlaying.IsUserListeningToSomething}
      <div tabindex="-1" class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 bg-neutral text-neutral-content mr-4">
        <div class="w-96">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">{t("nowPlaying.title")}</h2>
              <div class="flex items-center">
                <figure class="mr-4 w-2/5">
                  <img src={$nowPlaying.NowPlayingAlbumArt} alt="Album Art" class="" />
                </figure>
                <div class="min-w-0 flex-auto space-y-1 font-semibold">
                  <b class="text-lg">
                    <a class="link" href={$nowPlaying.NowPlayingUrl}>
                      {$nowPlaying.NowPlayingName}
                    </a>
                  </b>
                  <br />
                  <b>{$nowPlaying.NowPlayingArtist}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div tabindex="-1" class="dropdown-content absolute bottom-full right-0 transform -translate-y-2 z-10 bg-neutral text-neutral-content mr-4 w-64">
        <div class="card-body">{t("nowPlaying.notPlayingSomethingText")}</div>
      </div>
    {/if}
  {/if}
</div>
