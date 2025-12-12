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
