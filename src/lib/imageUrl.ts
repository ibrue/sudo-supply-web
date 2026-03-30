/**
 * Resolves an image URL for display.
 *
 * - storage://product-images/path → /api/images?path=path (signed URL proxy)
 * - /images/... → passed through (local public files)
 * - https://... → passed through (external URLs)
 */
export function resolveImageUrl(url: string): string {
  if (url.startsWith("storage://product-images/")) {
    const path = url.replace("storage://product-images/", "");
    return `/api/images?path=${encodeURIComponent(path)}`;
  }
  return url;
}
