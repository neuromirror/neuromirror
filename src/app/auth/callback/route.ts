import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requested = url.searchParams.get("next") ?? "/home";
  const next = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\") ? requested : "/home";
  const isPasswordReset = new URL(next, url.origin).pathname === "/reset-password";
  const failure = isPasswordReset
    ? "/forgot-password?error=reset-link-expired"
    : "/signin?error=oauth-failed";

  if (url.searchParams.has("error") || url.searchParams.has("error_code")) {
    return NextResponse.redirect(new URL(failure, url.origin));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL(failure, url.origin));
}
