import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question_id, body } = await req.json();
  if (!question_id || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("clerk_user_id", userId)
    .single();

  const { error } = await supabase.from("answers").insert({
    question_id,
    user_id: userId,
    user_name: profile?.name || profile?.email || "anonymous",
    body,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
