/**
 * Generate image URL for R2-served images
 * Uses the API endpoint that accesses the R2 binding
 */
export function getImageUrl(imagePath: string): string {
  // Handle different path formats
  let cleanPath = imagePath;

  // Remove @projects/images/ prefix if present
  if (imagePath.startsWith("@projects/images/")) {
    cleanPath = imagePath.replace("@projects/images/", "");
  }

  // Handle absolute file paths (Windows format)
  if (imagePath.includes(":\\") || imagePath.includes("/")) {
    // Extract just the filename and path relative to projects/images
    const parts = imagePath.split(/[/\\]/);
    const projectsIndex = parts.findIndex((part) => part === "projects");
    if (projectsIndex !== -1 && parts[projectsIndex + 1] === "images") {
      cleanPath = parts.slice(projectsIndex + 2).join("/");
    }
  }

  // Always use the API endpoint that accesses the R2 binding
  return `/api/images/${cleanPath}`;
}

/**
 * Generate image URL for hero images
 */
export function getHeroImageUrl(heroImagePath: string): string {
  return getImageUrl(heroImagePath);
}

/**
 * Generate image URLs for an array of images
 */
export function getImageUrls(imagePaths: string[]): string[] {
  return imagePaths.map(getImageUrl);
}

/**
 * Check if an image path is a local project image
 */
export function isProjectImage(imagePath: string): boolean {
  return imagePath.startsWith("@projects/images/") || imagePath.startsWith("projects/images/") || imagePath.includes("/projects/images/");
}

/**
 * Convert local image paths to R2-compatible paths
 */
export function convertToR2Path(imagePath: string): string {
  if (imagePath.startsWith("@projects/images/")) {
    return imagePath.replace("@projects/images/", "");
  }
  if (imagePath.startsWith("projects/images/")) {
    return imagePath.replace("projects/images/", "");
  }
  return imagePath;
}
