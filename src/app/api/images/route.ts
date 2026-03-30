import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * Proxies private Supabase Storage images via signed URLs.
 * Usage: /api/images?path=slug/filename.ext
 *
 * Generates a signed URL (valid 1 hour) and redirects to it.
 */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from("product-images")
      .createSignedUrl(path, 3600); // 1 hour

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
    }

    // Redirect to the signed URL
    return NextResponse.redirect(data.signedUrl);
  } catch {
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 });
  }
}
