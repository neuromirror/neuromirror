import type { Metadata } from "next";
import Link from "next/link";
import { PublicArticle, PublicPageJsonLd } from "@/components/public-article";
import { SITE } from "@/lib/site";

const title = "Memory Vault: Find and Organize Your Journal Entries";
const description =
  "Learn what NeuroMirror Memory Vault does today: keyword-based search, filters, a timeline, On This Day, and saved memories linked to your own journal entries.";

export const metadata: Metadata = {
  title: "Memory Vault Journal Search and Memory Organizer",
  description,
  alternates: { canonical: "/memory-vault-guide" },
  openGraph: { title: "Memory Vault | NeuroMirror", description, url: SITE.url + "/memory-vault-guide", type: "article", images: ["/opengraph-image"] },
};

export default function MemoryVaultGuidePage() {
  return (
    <>
      <PublicPageJsonLd title={title} path="/memory-vault-guide" description={description} />
      <PublicArticle
        title={title}
        eyebrow="Memory Vault · Journal organization"
        summary="Memory Vault is the private area for revisiting journal memories. Its current search preview uses keyword matching against your entries and links matches to the original writing, date, and excerpt."
      >
        <section aria-labelledby="what-is-vault">
          <h2 id="what-is-vault" className="font-display text-3xl text-ink">What is Memory Vault?</h2>
          <p className="mt-4">
            Memory Vault brings together ways to browse and organize your own past writing. It includes a search preview,
            filters, a timeline, On This Day, and saved memories. Results point back to entries in your account; the excerpts
            come from those entries rather than generated sample memories.
          </p>
        </section>

        <section aria-labelledby="how-search-works">
          <h2 id="how-search-works" className="font-display text-3xl text-ink">How does Memory Vault search work?</h2>
          <p className="mt-4">
            The current search preview looks for words that appear in the query and journal text. It can help when you remember
            a word, name, place, or phrase from an entry. If you describe an event using different words than you used in the
            journal, keyword search may not find it. Meaning-based search is not available yet.
          </p>
          <p>
            Search stays within your signed-in account and does not send your journal text to Gemini. The separate cognitive
            writing analysis is a user-requested action with its own data flow;{" "}
            <Link href="/how-cognitive-analysis-works" className="underline underline-offset-4">read how that works</Link>.
          </p>
        </section>

        <section aria-labelledby="other-memory-features">
          <h2 id="other-memory-features" className="font-display text-3xl text-ink">Ways to revisit your own writing</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>Use dates and the timeline to browse entries in chronological order.</li>
            <li>Use filters to narrow the entries you want to review.</li>
            <li>Check On This Day to revisit entries written on the same calendar date in earlier years, when available.</li>
            <li>Save meaningful entries as memories so they are easier to find again.</li>
          </ul>
          <p>
            These features organize personal records; they do not infer or verify what happened. The original entry remains the
            source of truth.
          </p>
        </section>

        <section aria-labelledby="privacy">
          <h2 id="privacy" className="font-display text-3xl text-ink">Private by account</h2>
          <p className="mt-4">
            Memory Vault content is tied to the signed-in account. Database security rules limit access to the owner’s records,
            and the app has no public journal pages. For details about account records, third-party analysis, and deletion
            requests, see the <Link href="/privacy" className="underline underline-offset-4">NeuroMirror privacy page</Link>.
          </p>
        </section>

        <p className="border-t border-line pt-8 text-sm text-ink-3">
          Want to keep a private written record over time? Explore the{" "}
          <Link href="/cognitive-health-journal" className="underline underline-offset-4">cognitive health journal</Link> or{" "}
          <Link href="/" className="underline underline-offset-4">visit NeuroMirror</Link>.
        </p>
      </PublicArticle>
    </>
  );
}

