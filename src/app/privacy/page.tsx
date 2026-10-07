import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How NeuroMirror protects personal writing and when a requested Gemini analysis uses a journal entry.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  ["Your account owns your data", "Journals, notes, notebooks, saved memories, cognitive analyses, and game results are stored in Supabase and protected by row-level security. Each account can access only its own records. Reports are calculated from your records and are not stored as separate files."],
  ["No public writing", "NeuroMirror has no public journal pages. Private application pages are protected by sign-in and marked so search engines do not index them. Your writing is never placed in page metadata."],
  ["How AI uses your text", "Gemini analysis runs only when you choose a journal and ask for analysis. The selected entry and up to five prior analysis summaries from your account are sent from a protected Supabase Edge Function to Gemini. Other journal entries are not sent. Autosave and Memory Vault search do not send writing to AI. Passwords and account tokens are not included."],
  ["Cognitive-language insights", "Insights are informational observations about writing patterns. They are not a diagnosis, never show a medical probability, and should not replace evaluation by a qualified professional."],
  ["Analytics", "If product analytics are used, they are aggregated and never include journal text, note text, Memory Vault queries, or insight content."],
  ["Deleting records", "You can delete individual journals and notes in the app. Account-wide deletion is not currently available in Settings; contact the site owner to request account removal. Data export is not currently available."],
  ["Honest security", "No system can promise absolute security. We describe the specific protections we use rather than making guarantees."],
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Logo />
      <main className="mt-16">
        <h1 className="font-display text-5xl text-ink">Privacy</h1>
        <p className="mt-5 font-serif text-xl leading-relaxed text-ink-2">
          Your journals and notes are private to your account and protected using authenticated access and database-level
          security controls.
        </p>
        <div className="mt-12 space-y-10">
          {SECTIONS.map(([h, p]) => (
            <section key={h}>
              <h2 className="font-display text-2xl text-ink">{h}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{p}</p>
            </section>
          ))}
        </div>
        <Link href="/" className="mt-16 inline-block text-sm text-accent underline underline-offset-4">Back to NeuroMirror</Link>
      </main>
    </div>
  );
}

