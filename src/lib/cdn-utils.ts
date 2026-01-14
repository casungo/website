/**
 * Converts a local image path to a CDN URL
 * @param localPath The local path (e.g., "@projects/images/20240810-Putangina Party/20240810-Putangina Party_1.jpg")
 * @returns The CDN URL (e.g., "https://cdn.casungo.top/20240810-Putangina Party/20240810-Putangina Party_1.jpg")
 */
// Define a type for Astro image objects
interface AstroImage {
  src: string;
  width: number;
  height: number;
  format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
}

export function getCdnUrl(localPath: string | AstroImage): string {
  // Handle both string paths and image objects with src property
  const path = typeof localPath === "string" ? localPath : localPath.src || "";

  return `https://cdn.casungo.top/${path}`;
}

/**
 * Converts an array of local image paths to CDN URLs
 * @param localPaths Array of local paths
 * @returns Array of CDN URLs
 */
export function getCdnUrls(localPaths: string[]): string[] {
  return localPaths.map((path) => getCdnUrl(path));
}

/**
 * Generates a secure thumbnail URL via our local proxy
 * @param localPath The local path or AstroImage object
 * @param width The desired width (must be in the allowlist: 400, 1280)
 */
export function getThumbUrl(localPath: string | AstroImage, width: number): string {
    const path = typeof localPath === "string" ? localPath : localPath.src || "";
    // Note: this path must not start with / or https://
    // The previous getCdnUrl implementation assumes localPath is like "folder/image.jpg"
    // We can reuse that logic but strip the potentially leading chars if needed.
    // However, looking at usage, input is usually "2024.../img.jpg"
    
    return `/thumb/${width}/${path}`;
}
