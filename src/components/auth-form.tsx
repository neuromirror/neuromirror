"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "forgot" | "reset";
const COPY: Record<Mode, { title: string; sub: string; cta: string }> = {
  signin: { title: "Welcome back", sub: "Sign in to your private journal.", cta: "Sign In" },
  signup: { title: "Create your journal", sub: "Create a private account for your writing.", cta: "Create account" },
  forgot: { title: "Reset your password", sub: "Enter your email and we’ll send a reset link.", cta: "Send reset link" },
  reset: { title: "Choose a new password", sub: "Set a new password for your account.", cta: "Save new password" },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); const [message, setMessage] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const c = COPY[mode];

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorCode = query.get("error_code") ?? fragment.get("error_code");
    const errorType = query.get("error") ?? fragment.get("error");

    if ((mode === "forgot" || mode === "reset") && (errorCode === "otp_expired" || errorType === "reset-link-expired")) {
      setError(mode === "forgot"
        ? "That password reset link has expired or was already used. Enter your email below to request a fresh link."
        : "That password reset link has expired or was already used. Return to sign-in and choose Forgot password to request a fresh link.");
    } else if (mode === "signin" && errorType === "oauth-failed") {
      setError("Google sign-in could not be completed. Please try again.");
    }
  }, [mode]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setMessage(null);
    if (mode !== "reset" && !/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (mode !== "forgot" && password.length < 8) return setError("Passwords need at least 8 characters.");
    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/home"); router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) { router.replace("/home"); router.refresh(); }
        else setMessage("No sign-in session was returned. This email may already have an account, or Confirm email is still enabled in Supabase. For immediate sign-in after signup, turn off Confirm email under Authentication → Sign In / Providers → Email. Existing users can sign in or reset their password.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=%2Freset-password` });
        if (error) throw error;
        setMessage("If an account exists for that email, a reset link is on its way.");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Your password has been updated. You can now sign in.");
      }
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Could not complete that request. Please try again.";
      const normalized = detail.toLowerCase();
      if (normalized.includes("rate limit") || normalized.includes("too many requests") || normalized.includes("email rate exceeded")) {
        setError("Supabase has temporarily rate-limited email from this project. Wait before retrying. For reliable password-reset email to users, connect a custom SMTP provider in Supabase Auth settings.");
      } else if (normalized.includes("email address not authorized")) {
        setError("Supabase’s default email service only delivers to authorized project addresses. Configure custom SMTP in Supabase Auth settings to send password-reset emails to your users.");
      } else if (normalized.includes("email not confirmed")) {
        setError("Email confirmation is still enabled for this Supabase project. The project owner must turn off Confirm email in Authentication → Sign In / Providers → Email.");
      } else if (normalized.includes("invalid login credentials")) {
        setError("Email or password is incorrect. Try again or use Forgot password.");
      } else {
        setError(detail);
      }
    }
    finally { setBusy(false); }
  }

  async function signInWithGoogle() {
    setError(null); setBusy(true);
    try {
      const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=/home` } });
      if (error) throw error;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Google sign-in could not start. Please try again.");
      setBusy(false);
    }
  }

  return <div className="rise">
    <h1 className="font-display text-4xl text-ink">{c.title}</h1><p className="mt-3 text-ink-2">{c.sub}</p>
    {message ? <p role="status" className="mt-8 rounded-md border border-line bg-card p-4 text-sm text-ink-2">{message}</p> : <form onSubmit={submit} noValidate className="mt-8 space-y-4">
      {mode !== "reset" && <div><label htmlFor="email" className="text-sm text-ink-2">Email</label><input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} aria-invalid={!!error} className="mt-1.5 w-full rounded-md border border-line-2 bg-card px-3.5 py-3 text-ink outline-none focus:border-accent" /></div>}
      {mode !== "forgot" && <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className="text-sm text-ink-2">Password</label>
          {mode === "signin" && <Link href="/forgot-password" className="text-xs text-ink-3 hover:text-ink">Forgot password?</Link>}
        </div>
        <div className="relative mt-1.5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-md border border-line-2 bg-card py-3 pl-3.5 pr-12 text-ink outline-none focus:border-accent"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(value => !value)}
            className="absolute inset-y-0 right-0 inline-flex items-center justify-center rounded-r-md px-3 text-ink-3 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>}
      {error && <p role="alert" className="text-sm text-clay">{error}</p>}
      <button disabled={busy} type="submit" className="w-full rounded-full bg-ink py-3 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-60">{busy ? "Please wait…" : c.cta}</button>
      {(mode === "signin" || mode === "signup") && <>
        <div className="flex items-center gap-3 text-xs text-ink-3"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        <button type="button" disabled={busy} onClick={signInWithGoogle} className="flex w-full items-center justify-center gap-2 rounded-full border border-line-2 bg-card py-3 text-sm text-ink hover:bg-paper-2 disabled:opacity-60"><span aria-hidden className="font-semibold">G</span> Continue with Google</button>
      </>}
    </form>}
    <p className="mt-8 text-sm text-ink-3">{mode === "signup" ? <>Already have an account? <Link href="/signin" className="text-ink underline underline-offset-4">Sign In</Link></> : mode === "signin" ? <>New to NeuroMirror? <Link href="/signup" className="text-ink underline underline-offset-4">Get Started</Link></> : <Link href="/signin" className="text-ink underline underline-offset-4">Back to Sign In</Link>}</p>
  </div>;
}

