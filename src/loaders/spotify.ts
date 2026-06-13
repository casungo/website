import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from "astro:env/server";
import type { LiveLoader } from "astro/loaders";

// Data structure expected by the frontend Svelte component
interface Artist {
  name: string;
  url: string;
}

interface NowPlayingData {
  IsUserListeningToSomething: boolean;
  NowPlayingArtists?: Artist[];
  NowPlayingAlbum?: string;
  NowPlayingAlbumArt?: string;
  NowPlayingAlbumUrl?: string;
  NowPlayingName?: string;
  NowPlayingUrl?: string;
  NowPlayingDuration?: number;
  NowPlayingProgress?: number;
  recentTracks?: {
    name: string;
    artists: Artist[];
    albumArt: string;
    url: string;
    playedAt: string;
  }[];
  [key: string]: unknown;
}

interface SpotifyImage {
  url: string;
}

interface SpotifyArtist {
  name: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyTrack {
  type?: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: SpotifyImage[];
    external_urls: {
      spotify: string;
    };
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}

interface CurrentlyPlayingResponse {
  is_playing?: boolean;
  item?: SpotifyTrack | null;
  progress_ms?: number;
}

interface RecentlyPlayedResponse {
  items?: {
    track: SpotifyTrack;
    played_at: string;
  }[];
}

class SpotifyLoaderError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "SpotifyLoaderError";
  }
}

// In-memory cache for the Spotify access token
let tokenCache: {
  accessToken: string | null;
  expiresAt: number;
} = {
  accessToken: null,
  expiresAt: 0,
};

async function getAccessToken(): Promise<string> {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken!;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error("Missing Spotify credentials in environment variables.");
  }

  const authorization = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${authorization}` },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }).toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to refresh Spotify token: ${response.status} ${errorData}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  // Spotify tokens expire in 3600s. Set expiry to 59 minutes from now.
  const expiresIn = (data.expires_in - 60) * 1000;
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn,
  };

  return tokenCache.accessToken!;
}

async function fetchSpotifyData<T>(url: RequestInfo | URL, accessToken: string): Promise<T | null> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (response.status === 204) return null; // No content, e.g., not currently playing
  if (!response.ok) throw new Error(`Spotify API error: ${response.status} for URL ${url}`);
  return (await response.json()) as T;
}

function isSpotifyTrack(item: SpotifyTrack | null | undefined): item is SpotifyTrack {
  return Boolean(item?.name && Array.isArray(item.artists) && item.album && item.external_urls?.spotify);
}

function mapTrack(track: SpotifyTrack) {
  return {
    name: track.name,
    artists: track.artists.map((artist) => ({ name: artist.name, url: artist.external_urls.spotify })),
    albumArt: track.album.images[0]?.url ?? "",
    url: track.external_urls.spotify,
  };
}

// The Live Loader definition
export function spotifyLoader(): LiveLoader<NowPlayingData, { id: string }, never, SpotifyLoaderError> {
  return {
    name: "spotify-loader",
    loadCollection: async () => ({ entries: [] }), // Not used for this singleton data source
    loadEntry: async ({ filter }) => {
      if (filter.id !== "now-playing") {
        return { error: new SpotifyLoaderError('Invalid entry ID. Use "now-playing".') };
      }

      try {
        const accessToken = await getAccessToken();
        const [currentlyPlayingResult, recentlyPlayedResult] = await Promise.allSettled([
          fetchSpotifyData<CurrentlyPlayingResponse>("https://api.spotify.com/v1/me/player/currently-playing?additional_types=track", accessToken),
          fetchSpotifyData<RecentlyPlayedResponse>("https://api.spotify.com/v1/me/player/recently-played?limit=5", accessToken),
        ]);

        if (currentlyPlayingResult.status === "rejected") {
          throw currentlyPlayingResult.reason;
        }

        if (recentlyPlayedResult.status === "rejected") {
          console.error("Spotify recently played fetch failed:", recentlyPlayedResult.reason);
        }

        const currentlyPlayingData = currentlyPlayingResult.value;
        const recentlyPlayedData = recentlyPlayedResult.status === "fulfilled" ? recentlyPlayedResult.value : null;
        const currentTrack = currentlyPlayingData?.is_playing && isSpotifyTrack(currentlyPlayingData.item) ? currentlyPlayingData.item : undefined;
        const recentTracks =
          recentlyPlayedData?.items
            ?.filter((item) => isSpotifyTrack(item.track))
            .map((item) => ({
              ...mapTrack(item.track),
              playedAt: item.played_at,
            })) || [];

        const data: NowPlayingData = currentTrack
          ? (() => {
              const mappedCurrentTrack = mapTrack(currentTrack);

              return {
                IsUserListeningToSomething: true,
                NowPlayingArtists: mappedCurrentTrack.artists,
                NowPlayingAlbum: currentTrack.album.name,
                NowPlayingAlbumArt: mappedCurrentTrack.albumArt,
                NowPlayingAlbumUrl: currentTrack.album.external_urls.spotify,
                NowPlayingName: mappedCurrentTrack.name,
                NowPlayingUrl: mappedCurrentTrack.url,
                NowPlayingDuration: currentTrack.duration_ms,
                NowPlayingProgress: currentlyPlayingData?.progress_ms ?? 0,
                recentTracks,
              };
            })()
          : { IsUserListeningToSomething: false, recentTracks };

        return {
          id: "now-playing",
          data,
          cacheHint: {
            // maxAge is not supported in this version of Astro's CacheHint (only tags and lastModified)
            // We can leave this empty or remove it.
          },
        };
      } catch (error: unknown) {
        console.error("Spotify Loader Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return { error: new SpotifyLoaderError(`Failed to fetch Spotify data: ${message}`, error) };
      }
    },
  };
}
