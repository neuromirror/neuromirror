import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
    <p className="text-xs uppercase tracking-[0.2em] text-ink-3">Settings</p><h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Settings</h1>
    <section aria-labelledby="appearance-h" className="mt-10 rounded-lg border border-line bg-card p-6"><h2 id="appearance-h" className="font-display text-xl text-ink">Appearance</h2><p className="mt-1 text-sm text-ink-2">Choose a warm light theme, a charcoal dark theme, or follow your device.</p><div className="mt-5"><ThemeSwitch /></div></section>
    <section className="mt-6 rounded-lg border border-line bg-card p-6"><h2 className="font-display text-xl text-ink">Account</h2><p className="mt-2 text-sm text-ink-2">Signed in as <span className="font-medium text-ink">{user?.email}</span></p><Link href="/forgot-password" className="mt-4 inline-block text-sm text-accent underline underline-offset-4">Reset password by email</Link></section>
    <section className="mt-6 rounded-lg border border-line bg-card p-6"><h2 className="font-display text-xl text-ink">Cognitive analysis and privacy</h2><p className="mt-2 text-sm leading-6 text-ink-2">Gemini analysis runs only when you choose a journal and request it. Autosave never sends writing to AI. Reports use that selected entry and up to five of your previous saved analysis summaries to reflect on changes in writing patterns. Your analysis history is stored with your account and covered by the same row-level access controls.</p><p className="mt-3 text-sm text-ink-2">Gemini connection: <span className="text-accent">Protected Supabase Edge Function</span></p><p className="mt-2 text-xs leading-5 text-ink-3">To enable analysis, add GEMINI_API_KEY under your Supabase project’s Edge Function Secrets. The key is never sent to this app or stored in its database.</p><Link href="/privacy" className="mt-3 inline-block text-sm text-accent underline underline-offset-4">Read the privacy details</Link></section>
  </div>;
}
