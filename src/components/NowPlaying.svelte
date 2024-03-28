<script>
  import { writable } from "svelte/store";

  const nowPlaying = writable(null);

  export let title;
  export let by;
  export let notPlayingSomethingText;

  const loading = writable(true);

  const fetchDataAndUpdate = async () => {
    try {
      const response = await fetch(`https://lastfmnowlistening.casungo.workers.dev`);
      const data = await response.json();
      nowPlaying.set(data.recenttracks.track[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading.set(false);
    }
  };

  /* Result from APi in JSON, DON'T DELETE, IT'S USED FOR TESTING:
{
    "recenttracks": {
        "track": [{
            "artist": {
                "mbid": "",
                "#text": "Salmo"
            },
            "streamable": "0",
            "image": [{
                "size": "small",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/34s\/4b783d22f903851b4166e3a4bd872fd3.jpg"
            }, {
                "size": "medium",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/64s\/4b783d22f903851b4166e3a4bd872fd3.jpg"
            }, {
                "size": "large",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/174s\/4b783d22f903851b4166e3a4bd872fd3.jpg"
            }, {
                "size": "extralarge",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/300x300\/4b783d22f903851b4166e3a4bd872fd3.jpg"
            }],
            "mbid": "",
            "album": {
                "mbid": "",
                "#text": "CVLT"
            },
            "name": "RESPIRA (feat. Marracash)",
            "@attr": {
                "nowplaying": "true"
            },
            "url": "https:\/\/www.last.fm\/music\/Salmo\/_\/RESPIRA+(feat.+Marracash)"
        }, {
            "artist": {
                "mbid": "b1e26560-60e5-4236-bbdb-9aa5a8d5ee19",
                "#text": "Post Malone"
            },
            "streamable": "0",
            "image": [{
                "size": "small",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/34s\/779b5a6eaa74c2870d6a54309c98f902.jpg"
            }, {
                "size": "medium",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/64s\/779b5a6eaa74c2870d6a54309c98f902.jpg"
            }, {
                "size": "large",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/174s\/779b5a6eaa74c2870d6a54309c98f902.jpg"
            }, {
                "size": "extralarge",
                "#text": "https:\/\/lastfm.freetls.fastly.net\/i\/u\/300x300\/779b5a6eaa74c2870d6a54309c98f902.jpg"
            }],
            "mbid": "",
            "album": {
                "mbid": "27e3aa95-4565-4d07-9ebd-6d918e7cb376",
                "#text": "AUSTIN"
            },
            "name": "Novacandy",
            "url": "https:\/\/www.last.fm\/music\/Post+Malone\/_\/Novacandy",
            "date": {
                "uts": "1709664239",
                "#text": "05 Mar 2024, 18:43"
            }
        }],
        "@attr": {
            "user": "casungo",
            "totalPages": "73226",
            "page": "1",
            "perPage": "1",
            "total": "73226"
        }
    }
}
*/
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
