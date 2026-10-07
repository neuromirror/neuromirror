import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const failure = new URL("/forgot-password?error=reset-link-expired", url.origin);
  const code = url.searchParams.get("code");

  if (url.searchParams.has("error") || url.searchParams.has("error_code") || !code) {
    return NextResponse.redirect(failure);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/forgot-password?error=reset-link-expired" : "/reset-password", url.origin));
}
