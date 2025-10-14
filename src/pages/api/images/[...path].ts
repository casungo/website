export async function GET({ params, locals }: { params: { path: string[] }; locals: any }) {
  const { path } = params;
  const imagePath = `projects/images/${path.join("/")}`;

  try {
    // Check if R2 binding is available
    if (!locals?.runtime?.env?.IMAGES) {
      console.error("R2 IMAGES binding not available. Make sure you're running with wrangler dev.");
      return new Response("R2 binding not available. Use 'wrangler dev' instead of 'astro dev'.", { status: 500 });
    }

    // Get the image from R2 bucket
    const object = await locals.runtime.env.IMAGES.get(imagePath);

    if (!object) {
      console.error(`Image not found in R2: ${imagePath}`);
      return new Response("Image not found", { status: 404 });
    }

    // Determine content type based on file extension
    const ext = path.join("/").split(".").pop()?.toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "webp":
        contentType = "image/webp";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "avif":
        contentType = "image/avif";
        break;
    }

    return new Response(object.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        ETag: object.httpEtag || "",
      },
    });
  } catch (error) {
    console.error("Error serving image from R2:", error);
    return new Response(`Internal server error: ${error.message}`, { status: 500 });
  }
}
