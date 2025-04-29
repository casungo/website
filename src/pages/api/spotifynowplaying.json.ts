import type { APIRoute } from "astro";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from "astro:env/server";

export const prerender = false;

async function getAccessToken() {
  const authorization = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authorization}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }).toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to refresh token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchSpotifyData(url: RequestInfo | URL, accessToken: any) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
  return response.json();
}

export const GET: APIRoute = async () => {
  try {
    const accessToken = await getAccessToken();

    const [currentlyPlayingData, recentlyPlayedData] = await Promise.all([
      fetchSpotifyData("https://api.spotify.com/v1/me/player/currently-playing", accessToken),
      fetchSpotifyData("https://api.spotify.com/v1/me/player/recently-played?limit=5", accessToken),
    ]);

    const isPlaying = currentlyPlayingData?.is_playing && currentlyPlayingData?.item;

    const recentTracks =
      recentlyPlayedData?.items?.map((item: { track: { name: any; artists: any[]; album: { images: { url: any }[] }; external_urls: { spotify: any } }; played_at: any }) => ({
        name: item.track.name,
        artist: item.track.artists.map((artist: { name: any }) => artist.name).join(", "),
        albumArt: item.track.album.images[0]?.url,
        url: item.track.external_urls.spotify,
        playedAt: item.played_at,
      })) || [];

    if (!isPlaying) {
      return new Response(
        JSON.stringify({
          IsUserListeningToSomething: false,
          recentTracks,
          debug: {
            currentlyPlayingRaw: currentlyPlayingData,
            recentlyPlayedRaw: recentlyPlayedData,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        NowPlayingArtist: currentlyPlayingData.item.artists.map((artist: { name: any }) => artist.name).join(", "),
        NowPlayingArtistUrl: currentlyPlayingData.item.artists[0]?.external_urls.spotify,
        NowPlayingAlbum: currentlyPlayingData.item.album.name,
        NowPlayingAlbumArt: currentlyPlayingData.item.album.images[0]?.url,
        NowPlayingAlbumUrl: currentlyPlayingData.item.album.external_urls.spotify,
        NowPlayingName: currentlyPlayingData.item.name,
        NowPlayingUrl: currentlyPlayingData.item.external_urls.spotify,
        NowPlayingDuration: currentlyPlayingData.item.duration_ms,
        NowPlayingProgress: currentlyPlayingData.progress_ms,
        IsUserListeningToSomething: true,
        recentTracks,
        debug: {
          currentlyPlayingRaw: currentlyPlayingData,
          recentlyPlayedRaw: recentlyPlayedData,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Spotify API error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({
        error: "Failed to fetch data",
        errorMessage: errorMessage,
        IsUserListeningToSomething: false,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
