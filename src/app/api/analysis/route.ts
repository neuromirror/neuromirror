import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to analyze a journal." }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const journalId = body && typeof body === "object" ? (body as { journalId?: unknown }).journalId : null;
  if (typeof journalId !== "string" || !/^[0-9a-f-]{36}$/i.test(journalId)) {
    return NextResponse.json({ error: "Choose a valid journal." }, { status: 400 });
  }

  const { data, error } = await supabase.functions.invoke("cognitive-analysis", { body: { journalId } });
  if (error) {
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      const payload = await context.json().catch(() => null) as { error?: string } | null;
      return NextResponse.json(
        { error: payload?.error || "Cognitive analysis could not complete. Please try again." },
        { status: context.status || 502 },
      );
    }
    return NextResponse.json({ error: "Cognitive analysis could not reach Supabase. Please try again." }, { status: 502 });
  }
  if (!data || typeof data !== "object" || !("analysis" in data)) {
    return NextResponse.json({ error: "The analysis service returned an invalid response." }, { status: 502 });
  }

  return NextResponse.json(data);
}
