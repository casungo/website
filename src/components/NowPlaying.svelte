<script>
  import { writable } from "svelte/store";

  const nowPlaying = writable(null);
  const loading = writable(true);

  export let title;
  export let by;
  export let notPlayingSomethingText;

  const fetchDataAndUpdate = async () => {
    try {
      const response = await fetch(`/api/lastfmnowlistening.json`);
      const data = await response.json();
      nowPlaying.set(data.recenttracks.track[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading.set(false);
    }
  };
</script>

<div class="position-fixed bottom-0 end-0" style="z-index: 7;">
  <div class="collapse" id="collapseWidthExample">
    {#if $loading}
      <div class="pm-3 mx-3 my-2 card position-sticky top-100 start-100">
        <div class="card-body">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    {:else if $nowPlaying && $nowPlaying["@attr"] && $nowPlaying["@attr"].nowplaying === "true"}
      <div class="pm-3 mx-3 my-2 card position-sticky top-100 start-100">
        <div class="row g-0">
          <div class="col-4">
            <img src={$nowPlaying.image[3]["#text"]} class="img-fluid rounded-start img-cover" draggable="false" alt="Album Art" width="150" />
          </div>
          <div class="col-8">
            <div class="card-body">
              <h6 class="card-title">{title}</h6>
              <p class="card-text"><b><a class="link-body-emphasis link-offset-2 link-underline-opacity-0 link-underline-opacity-75-hover" href={$nowPlaying.url}>{$nowPlaying.name}</a></b></p>
              <p class="card-text text-body-secondary">
                {by}
                <b>{$nowPlaying.artist["#text"]}</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="pm-3 mx-3 my-2 card position-sticky top-100 start-100" style="width: 18rem;">
        <div class="card-body">{notPlayingSomethingText}</div>
      </div>
    {/if}
  </div>
  <p>
    <button
      on:click={fetchDataAndUpdate}
      class="position-sticky top-100 start-100 pm-3 mx-3 btn btn-light"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapseWidthExample"
      aria-expanded="false"
      aria-controls="collapseWidthExample"
      ><i class="bi bi-music-note"></i>
    </button>
  </p>
</div>
