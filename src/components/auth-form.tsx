"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const c = COPY[mode];

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
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/home` } });
        if (error) throw error;
        if (data.session) { router.replace("/home"); router.refresh(); }
        else setMessage("Account created. Check your email if confirmation is enabled for this Supabase project, then sign in.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset-password` });
        if (error) throw error;
        setMessage("If an account exists for that email, a reset link is on its way.");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Your password has been updated. You can now sign in.");
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not complete that request. Please try again."); }
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
      {mode !== "forgot" && <div><div className="flex items-baseline justify-between"><label htmlFor="password" className="text-sm text-ink-2">Password</label>{mode === "signin" && <Link href="/forgot-password" className="text-xs text-ink-3 hover:text-ink">Forgot password?</Link>}</div><input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} className="mt-1.5 w-full rounded-md border border-line-2 bg-card px-3.5 py-3 text-ink outline-none focus:border-accent" /></div>}
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
