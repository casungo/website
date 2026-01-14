
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  const { width, path } = params;

  // 1. Validate Width
  const allowedWidths = [400, 1280]; // Defined allowlist
  const parsedWidth = parseInt(width || "0");

  if (!allowedWidths.includes(parsedWidth)) {
    return new Response("Invalid width", { status: 400 });
  }

  // 2. Validate Path and Domain (implicitly handled by valid path reconstruction)
  // Ensure the path is not empty
  if (!path) {
    return new Response("Missing image path", { status: 400 });
  }

  // Reconstruct source URL
  // Assuming the 'path' parameter captures the rest of the URL including directory structure
  // e.g. /thumb/400/20240427-Festa pazza matta/image.jpg
  // "path" will be "20240427-Festa pazza matta/image.jpg"
  const imageUrl = `https://cdn.casungo.top/${path}`;

  // 3. Fetch from Cloudflare with Resizing Options
  // Using the Cloudflare specific 'cf' property in the init object
  
  // Note: We strip headers to avoid passing irrelevant ones, but forward necessary ones if needed.
  // For a simple resize proxy, a fresh request is usually robust.
  
  try {
     const response = await fetch(imageUrl, {
       cf: {
         image: {
           width: parsedWidth,
           // Let Cloudflare calculate height to maintain aspect ratio
           fit: "scale-down",
           format: "webp" // Enforce webp or auto
         }
       }
     } as any); // Cast to any because 'cf' is not in standard RequestInit type

     // Create a new response to pass back to the client
     // We should forward the Content-Type header from the upstream response
     const contentType = response.headers.get("Content-Type");

     return new Response(response.body, {
       status: response.status,
       headers: {
         "Content-Type": contentType || "image/jpeg",
         "Cache-Control": "public, max-age=31536000, immutable" // Cache aggressively
       }
     });

  } catch (e) {
    console.error("Image proxy error:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
};
