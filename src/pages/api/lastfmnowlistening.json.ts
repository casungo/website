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

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(API_URL);
    const data: LastFmResponse = await response.json();
    const [currentTrack, previousTrack] = data.recenttracks.track;

    if (currentTrack["@attr"]?.nowplaying === "true") {
      return createResponse({
        NowPlayingArtist: currentTrack.artist["#text"],
        NowPlayingAlbum: currentTrack.album["#text"],
        NowPlayingAlbumArt: currentTrack.image.find(img => img.size === "extralarge")?.["#text"],
        NowPlayingName: currentTrack.name,
        NowPlayingUrl: currentTrack.url,
        NowPlayingDuration: currentTrack.duration ? parseInt(currentTrack.duration) : null,
        LastPlayedName: previousTrack?.name,
        LastPlayedUrl: previousTrack?.url,
        LastPlayedArt: previousTrack?.image.find(img => img.size === "extralarge")?.["#text"],
        IsUserListeningToSomething: true,
      }, response.status);
    }

    return createResponse({
      LastPlayedDate: currentTrack.date?.["#text"],
      LastPlayedName: currentTrack.name,
      LastPlayedUrl: currentTrack.url,
      LastPlayedArt: currentTrack.image.find(img => img.size === "extralarge")?.["#text"],
      IsUserListeningToSomething: false,
    }, response.status);

  } catch (error: any) {
    return createResponse({ 
      error: "Failed to fetch data", 
      errorMessage: error.message 
    }, 500);
  }
};
