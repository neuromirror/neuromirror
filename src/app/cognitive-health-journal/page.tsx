import type { Metadata } from "next";
import Link from "next/link";
import { FAQJsonLd, PublicArticle, PublicPageJsonLd } from "@/components/public-article";
import { SITE } from "@/lib/site";

const title = "A Private Journal for Cognitive Health Reflection";
const description =
  "Learn how NeuroMirror combines private journaling with optional, non-diagnostic observations about writing over time. See what it does, what it does not do, and how your text is handled.";
const faqs = [
  {
    question: "What is a cognitive health journal?",
    answer:
      "A cognitive health journal is a personal place to record writing, memories, and reflections over time. NeuroMirror adds an optional way to request observations about patterns in a selected written entry; it is not a clinical test.",
  },
  {
    question: "Can a journal or AI analysis diagnose memory loss?",
    answer:
      "No. NeuroMirror does not diagnose, predict, or rule out memory or cognitive conditions. Its AI output is informational writing feedback, not a medical assessment.",
  },
  {
    question: "Does NeuroMirror analyze every journal automatically?",
    answer:
      "No. You must choose an entry and request analysis. Autosave does not send writing to Gemini. Only the selected entry and up to five prior analysis summaries are included in that request.",
  },
];

export const metadata: Metadata = {
  title: "Private Cognitive Health Journal for Writing Reflection",
  description,
  alternates: { canonical: "/cognitive-health-journal" },
  openGraph: { title: "Private Cognitive Health Journal | NeuroMirror", description, url: SITE.url + "/cognitive-health-journal", type: "article", images: ["/opengraph-image"] },
};

export default function CognitiveHealthJournalPage() {
  return (
    <>
      <PublicPageJsonLd title={title} path="/cognitive-health-journal" description={description} />
      <FAQJsonLd items={faqs} />
      <PublicArticle
        title={title}
        eyebrow="NeuroMirror · Cognitive health and journaling"
        summary="NeuroMirror is a private digital journal with optional AI-generated observations about a journal entry you choose. It can help you review your own writing over time; it cannot test, diagnose, or predict cognitive health."
      >
        <section aria-labelledby="short-answer">
          <h2 id="short-answer" className="font-display text-3xl text-ink">What does NeuroMirror do?</h2>
          <p className="mt-4">
            Write dated journals and undated notes, organize them, and return to what you recorded. If you want a language
            reflection, choose a saved journal entry and request one. NeuroMirror sends the selected entry to its protected
            Gemini analysis function and returns observations in plain language. The feature is optional and never runs on
            autosave.
          </p>
          <p>
            The purpose is to make reflection and record-keeping easier. An AI-generated observation is not a cognitive score,
            validated screening result, or medical opinion.
          </p>
        </section>

        <section aria-labelledby="what-it-observes">
          <h2 id="what-it-observes" className="font-display text-3xl text-ink">What can a writing reflection include?</h2>
          <p className="mt-4">
            The analysis prompt asks the model to describe features visible in the selected text, such as sentence structure,
            coherence, sequencing, repetition, and specificity. These are descriptions of a piece of writing in context—not
            measurements of a person’s brain or a conclusion about why they wrote that way.
          </p>
          <p>
            A short entry, a different topic, fatigue, mood, language choice, editing, or many everyday circumstances can
            change how someone writes. A single passage cannot establish a trend. NeuroMirror presents reflections for you to
            consider rather than treating changes as evidence of illness.
          </p>
        </section>

        <section aria-labelledby="how-to-use">
          <h2 id="how-to-use" className="font-display text-3xl text-ink">How to use a cognitive health journal</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6">
            <li>Write naturally about your day, a memory, or something you want to remember. There is no daily target.</li>
            <li>Use dates, tags, and notebooks to make your own entries easier to revisit.</li>
            <li>If useful, select a saved entry and request a language reflection. Review the response alongside the original words.</li>
            <li>Keep observations in perspective. They are generated feedback, not a health test.</li>
          </ol>
          <p>
            If changes in memory or thinking concern you, a journal cannot determine their cause. The U.S. National Institute
            on Aging recommends talking with a health care provider about memory problems that concern you.{" "}
            <a
              className="underline underline-offset-4"
              href="https://www.nia.nih.gov/health/memory-loss-and-forgetfulness/memory-forgetfulness-and-aging-whats-normal-and-whats-not"
              target="_blank"
              rel="noreferrer"
            >
              Read the National Institute on Aging guidance
            </a>.
          </p>
        </section>

        <section aria-labelledby="privacy-analysis">
          <h2 id="privacy-analysis" className="font-display text-3xl text-ink">What happens to writing during analysis?</h2>
          <p className="mt-4">
            Analysis is initiated only after you choose an entry and ask for it. The selected entry and up to five earlier
            analysis summaries from your account are sent to Gemini through a server-side Supabase Edge Function. Other journal
            entries are not sent as context. Memory Vault search does not use Gemini.{" "}
            <Link href="/privacy" className="underline underline-offset-4">Read the privacy details</Link>.
          </p>
        </section>

        <section aria-labelledby="faq" className="border-t border-line pt-8">
          <h2 id="faq" className="font-display text-3xl text-ink">Cognitive health journal questions</h2>
          <div className="mt-5 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-display text-xl text-ink">{faq.question}</h3>
                <p className="mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="border-t border-line pt-8 text-sm text-ink-3">
          Ready to write? <Link href="/signup" className="underline underline-offset-4">Create a NeuroMirror account</Link> or{" "}
          <Link href="/how-cognitive-analysis-works" className="underline underline-offset-4">see how analysis works</Link>.
        </p>
      </PublicArticle>
    </>
  );
}

