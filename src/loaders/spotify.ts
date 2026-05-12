import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from "astro:env/server";

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
  item?: SpotifyTrack;
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

// The Live Loader definition
export function spotifyLoader() {
  return {
    name: "spotify-loader",
    loadCollection: async () => ({ entries: [] }), // Not used for this singleton data source
    loadEntry: async ({ filter }: { filter: { id: string } }) => {
      if (filter.id !== "now-playing") {
        return { error: new SpotifyLoaderError('Invalid entry ID. Use "now-playing".') };
      }

      try {
        const accessToken = await getAccessToken();
        const [currentlyPlayingData, recentlyPlayedData] = await Promise.all([
          fetchSpotifyData<CurrentlyPlayingResponse>("https://api.spotify.com/v1/me/player/currently-playing", accessToken),
          fetchSpotifyData<RecentlyPlayedResponse>("https://api.spotify.com/v1/me/player/recently-played?limit=5", accessToken),
        ]);

        const currentTrack = currentlyPlayingData?.is_playing ? currentlyPlayingData.item : undefined;
        const recentTracks =
          recentlyPlayedData?.items?.map((item) => ({
            name: item.track.name,
            artists: item.track.artists.map((artist) => ({ name: artist.name, url: artist.external_urls.spotify })),
            albumArt: item.track.album.images[0]?.url,
            url: item.track.external_urls.spotify,
            playedAt: item.played_at,
          })) || [];

        const data: NowPlayingData = currentTrack
          ? {
              IsUserListeningToSomething: true,
              NowPlayingArtists: currentTrack.artists.map((artist) => ({ name: artist.name, url: artist.external_urls.spotify })),
              NowPlayingAlbum: currentTrack.album.name,
              NowPlayingAlbumArt: currentTrack.album.images[0]?.url,
              NowPlayingAlbumUrl: currentTrack.album.external_urls.spotify,
              NowPlayingName: currentTrack.name,
              NowPlayingUrl: currentTrack.external_urls.spotify,
              NowPlayingDuration: currentTrack.duration_ms,
              NowPlayingProgress: currentlyPlayingData?.progress_ms,
              recentTracks,
            }
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
