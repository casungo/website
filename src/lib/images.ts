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

  // Handle any _astro processed paths by extracting the original filename
  if (cleanPath.includes("_astro/")) {
    // Extract the original filename from the processed path
    // Example: _astro/20240525-No Name Party_hero.Drs1c_6P.jpg
    // becomes: 20240525-No Name Party/20240525-No Name Party_hero.jpg
    const astroMatch = cleanPath.match(/_astro\/(.+?)\.[A-Za-z0-9_]+\.(jpg|jpeg|png|webp|gif|avif)$/);
    if (astroMatch) {
      const originalFilename = astroMatch[1];
      const extension = astroMatch[2];
      
      // Try to find the original folder by matching the project name
      const projectFolderMatch = originalFilename.match(/^(.+?)_hero/);
      if (projectFolderMatch) {
        const projectFolder = projectFolderMatch[1];
        cleanPath = `${projectFolder}/${originalFilename}.${extension}`;
      } else {
        // Fallback: try to match any project folder pattern
        const folderMatch = originalFilename.match(/^(.+?)_\d+$/);
        if (folderMatch) {
          const projectFolder = folderMatch[1];
          cleanPath = `${projectFolder}/${originalFilename}.${extension}`;
        }
      }
    }
  }

  // Ensure we don't have double slashes in the path
  cleanPath = cleanPath.replace(/\/+/g, '/');

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
