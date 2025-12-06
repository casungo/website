import type { APIRoute } from "astro";
import { getLiveEntry } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
  const { entry, error, cacheHint } = await getLiveEntry("spotify", "now-playing");

  if (error) {
    console.error("Error fetching from 'spotify' live collection:", (error as Error).message);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({
        error: "Failed to fetch data from Spotify loader",
        errorMessage: errorMessage,
        IsUserListeningToSomething: false,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // Use the cacheHint from the loader to set response headers for CDN and browser caching
  // Type assertion to handle potential type mismatch with CacheHint interface
  const cacheHintAny = cacheHint as any;
  if (cacheHintAny?.maxAge) {
    headers.set("Cache-Control", `public, s-maxage=${cacheHintAny.maxAge}, max-age=${cacheHintAny.maxAge}`);
  }

  // The loader provides the full data structure, ready to be sent to the client.
  if (!entry) {
    return new Response(
      JSON.stringify({
        error: "No entry data returned from Spotify loader",
        IsUserListeningToSomething: false,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
  return new Response(JSON.stringify(entry.data), {
    status: 200,
    headers: headers,
  });
};
