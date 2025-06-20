import type { APIRoute } from "astro";
import { getLiveEntry } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
  // Use the new Live Collection API to get the data
  const { entry, error } = await getLiveEntry("spotify", "now-playing");

  if (error) {
    console.error("Error fetching from 'spotify' live collection:", error.message);
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

  // The loader provides the full data structure, ready to be sent to the client.
  return new Response(JSON.stringify(entry.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
