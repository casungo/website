import type { APIRoute } from "astro";
import { LASTFM_API_KEY } from "astro:env/server";

export const prerender = false;

interface LastFmTrack {
  artist: { "#text": string };
  album: { "#text": string };
  image: { "#text": string; size: string }[];
  name: string;
  url: string;
  duration?: string;
  date?: { "#text": string };
  "@attr"?: { nowplaying: string };
}

interface LastFmResponse {
  recenttracks: {
    track: LastFmTrack[];
  };
}

const LASTFM_USER = "casungo";
const API_URL = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&limit=1&format=json`;

const createResponse = (data: any, status: number) => 
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const getAlbumArt = (images: { "#text": string; size: string }[]) =>
  images.find(img => img.size === "extralarge")?.["#text"];

const handleNowPlaying = (currentTrack: LastFmTrack, previousTrack: LastFmTrack) => ({
  NowPlayingArtist: currentTrack.artist["#text"],
  NowPlayingAlbum: currentTrack.album["#text"],
  NowPlayingAlbumArt: getAlbumArt(currentTrack.image),
  NowPlayingName: currentTrack.name,
  NowPlayingUrl: currentTrack.url,
  NowPlayingDuration: currentTrack.duration ? parseInt(currentTrack.duration) : null,
  LastPlayedName: previousTrack?.name,
  LastPlayedUrl: previousTrack?.url,
  LastPlayedArt: getAlbumArt(previousTrack?.image),
  IsUserListeningToSomething: true,
});

const handleNotPlaying = (currentTrack: LastFmTrack) => ({
  LastPlayedDate: currentTrack.date?.["#text"],
  LastPlayedName: currentTrack.name,
  LastPlayedUrl: currentTrack.url,
  LastPlayedArt: getAlbumArt(currentTrack.image),
  IsUserListeningToSomething: false,
});

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(API_URL);
    const data: LastFmResponse = await response.json();
    const [currentTrack, previousTrack] = data.recenttracks.track;

    return currentTrack["@attr"]?.nowplaying === "true"
      ? createResponse(handleNowPlaying(currentTrack, previousTrack), response.status)
      : createResponse(handleNotPlaying(currentTrack), response.status);

  } catch (error: any) {
    console.error("Last.fm API error:", error);
    return createResponse({ 
      error: "Failed to fetch data",
      errorMessage: error.message,
      lastfmError: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
};
