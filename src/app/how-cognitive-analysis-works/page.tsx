import type { Metadata } from "next";
import Link from "next/link";
import { FAQJsonLd, PublicArticle, PublicPageJsonLd } from "@/components/public-article";
import { SITE } from "@/lib/site";

const title = "How NeuroMirror’s Cognitive Writing Analysis Works";
const description =
  "A plain-language explanation of NeuroMirror’s optional Gemini writing analysis: what you select, what text is sent, what the output means, and its limits.";
const faqs = [
  {
    question: "When does Gemini receive my journal text?",
    answer:
      "Only after you choose a saved journal entry and explicitly request analysis. Autosave and ordinary journaling do not trigger Gemini.",
  },
  {
    question: "What text is sent for analysis?",
    answer:
      "The selected entry and up to five earlier analysis summaries from your account are sent through a protected Supabase Edge Function. Other journal entries, passwords, and account tokens are not sent.",
  },
  {
    question: "Is the analysis a cognitive test?",
    answer:
      "No. It produces informational observations about writing patterns and does not score, diagnose, or predict a medical condition.",
  },
];

export const metadata: Metadata = {
  title: "How AI Cognitive Writing Analysis Works",
  description,
  alternates: { canonical: "/how-cognitive-analysis-works" },
  openGraph: { title: "How NeuroMirror Analysis Works", description, url: SITE.url + "/how-cognitive-analysis-works", type: "article", images: ["/opengraph-image"] },
};

export default function AnalysisMethodPage() {
  return (
    <>
      <PublicPageJsonLd title={title} path="/how-cognitive-analysis-works" description={description} />
      <FAQJsonLd items={faqs} />
      <PublicArticle
        title={title}
        eyebrow="Product method · Privacy · Limitations"
        summary="NeuroMirror’s cognitive writing analysis is an optional reflection on one journal entry you select. It runs only when you request it and returns observations about language—not a score, screening result, or diagnosis."
      >
        <section aria-labelledby="steps">
          <h2 id="steps" className="font-display text-3xl text-ink">The analysis flow, step by step</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6">
            <li>You open a saved journal entry and explicitly choose its analysis action.</li>
            <li>The app checks that the selected text is within the feature’s supported length.</li>
            <li>A protected Supabase Edge Function prepares the request. It includes that entry and, when available, up to five earlier analysis summaries from your account.</li>
            <li>The server calls Gemini and asks it for cautious, non-diagnostic observations about writing patterns.</li>
            <li>The result is saved to your account and shown with a reminder that it is informational, not medical advice.</li>
          </ol>
          <p>
            Autosave never starts analysis. An account’s other full journal entries are not added as hidden context, and the
            analysis request does not include your password or account tokens.
          </p>
        </section>

        <section aria-labelledby="patterns">
          <h2 id="patterns" className="font-display text-3xl text-ink">What the model is asked to notice</h2>
          <p className="mt-4">
            The prompt asks for observations grounded in the words provided, including sentence structure, coherence,
            sequencing, repetition, and specificity. The model may describe what appears in that entry and compare the
            reflection with earlier summaries. It cannot see a person’s full life, health history, or every reason behind a
            writing choice.
          </p>
          <p>
            Gemini can make mistakes or overlook context. Read the response as a fallible reflection and compare it with the
            original text. NeuroMirror does not convert the response into a probability, cognitive score, or medical
            determination.
          </p>
        </section>

        <section aria-labelledby="privacy">
          <h2 id="privacy" className="font-display text-3xl text-ink">When does analysis use personal writing?</h2>
          <p className="mt-4">
            Only the user-requested analysis sends journal text to the Gemini service. Memory Vault currently searches your own
            entries with keyword matching and does not call Gemini. You can continue using the journal, notes, calendar, and
            games without requesting an analysis.{" "}
            <Link href="/privacy" className="underline underline-offset-4">The privacy page explains the data flow</Link>.
          </p>
        </section>

        <section aria-labelledby="limitations">
          <h2 id="limitations" className="font-display text-3xl text-ink">Important limits</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>This feature has not been presented as a validated medical or cognitive assessment.</li>
            <li>Writing varies with subject, audience, language, mood, health, editing, and ordinary daily conditions.</li>
            <li>A writing pattern cannot by itself identify its cause or establish a diagnosis.</li>
            <li>If you are concerned about memory or thinking, discuss those concerns with a qualified health care professional.</li>
          </ul>
        </section>

        <section aria-labelledby="faq" className="border-t border-line pt-8">
          <h2 id="faq" className="font-display text-3xl text-ink">Analysis questions</h2>
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
          Learn about the <Link href="/cognitive-health-journal" className="underline underline-offset-4">private cognitive health journal</Link> or{" "}
          <Link href="/" className="underline underline-offset-4">visit NeuroMirror</Link>.
        </p>
      </PublicArticle>
    </>
  );
}

