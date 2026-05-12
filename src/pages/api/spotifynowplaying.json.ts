import type { APIRoute } from "astro";
import { getLiveEntry } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
  const { entry, error, cacheHint } = await getLiveEntry("spotify", "now-playing");

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  // Use the cacheHint from the loader to set response headers
  if (cacheHint?.lastModified) {
    headers.set("Last-Modified", cacheHint.lastModified.toUTCString());
  }

  // Set a default short cache control for real-time updates
  // Re-validate frequently as songs change often
  headers.set("Cache-Control", "public, max-age=15, s-maxage=30, stale-while-revalidate=10");

  if (error) {
    console.error("Error fetching from 'spotify' live collection:", error.message);
    headers.set("Cache-Control", "no-store");
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({
        error: "Failed to fetch data from Spotify loader",
        errorMessage,
        IsUserListeningToSomething: false,
      }),
      {
        status: 500,
        headers,
      },
    );
  }

  if (!entry) {
    console.error("No entry data returned from Spotify loader");
    headers.set("Cache-Control", "no-store");

    return new Response(
      JSON.stringify({
        error: "No entry data returned from Spotify loader",
        IsUserListeningToSomething: false,
      }),
      {
        status: 500,
        headers,
      },
    );
  }

  return new Response(JSON.stringify(entry.data), {
    status: 200,
    headers,
  });
};
