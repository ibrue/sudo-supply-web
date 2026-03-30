/**
 * Resolves an image URL for display.
 * Handles legacy storage:// paths by converting to public URL.
 * Regular URLs pass through unchanged.
 */
export function resolveImageUrl(url: string): string {
  if (url.startsWith("storage://product-images/")) {
    // Legacy path — convert to direct Supabase public URL
    const path = url.replace("storage://product-images/", "");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/product-images/${path}`;
  }
  return url;
}
