import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { AdSenseLoader } from "@/components/adsense-loader";
import { AdSenseUnit } from "@/components/adsense-unit";
import { SITE } from "@/lib/site";
import {
  BookOpen,
  Brain,
  HeartPulse,
  Lock,
  Mic,
  NotebookPen,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About NeuroMirror – Science, Mission & Architecture of Cognitive Journaling",
  description:
    "Learn about NeuroMirror's founding mission, cognitive linguistic research, privacy-first zero-knowledge architecture, and non-diagnostic approach to mind health awareness.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: SITE.url + "/about",
    siteName: SITE.name,
    title: "About NeuroMirror – The Science & Story Behind Cognitive Reflection",
    description:
      "Discover why writing is the most intimate mirror of the human mind, and how NeuroMirror combines private journaling with ethical AI analysis.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "About NeuroMirror" }],
  },
};

const FEATURES = [
  {
    icon: NotebookPen,
    title: "Private Journals & Notes",
    body: "Write dated reflections and capture quick ideas in a distraction-free editor. Rich text formatting, autosave, notebooks, and tags keep every thought organized.",
  },
  {
    icon: Brain,
    title: "Cognitive-Language Analysis",
    body: "When you explicitly choose, a selected journal entry is analyzed by Cloudflare Workers AI to surface informational observations on lexical variety, syntactic flow, and structural patterns — strictly non-diagnostic with zero scores.",
  },
  {
    icon: Mic,
    title: "Voice Journaling with Whisper",
    body: "Speak naturally and let Cloudflare Whisper transcribe your words with high fidelity. Live browser dictation works offline; review and edit transcripts before saving.",
  },
  {
    icon: Palette,
    title: "Freeform Pressure-Sensitive Canvas",
    body: "Sketch mind maps, doodle, or write by hand with a stylus. Canvas pages save seamlessly alongside text entries for visual thinkers.",
  },
  {
    icon: Search,
    title: "Instant Memory Vault Search",
    body: "Search across all your historical journals and notes in milliseconds. Revisit past feelings, decisions, and memories by exact words or thematic tags.",
  },
  {
    icon: BookOpen,
    title: "Structured Notebooks",
    body: "Organize journals into distinct life notebooks — Career, Personal Growth, Family Memories, Creative Drafts, and Travel Reflections.",
  },
  {
    icon: HeartPulse,
    title: "Affective Mood Tracking",
    body: "Tag entries with self-reported moods. Longitudinal reports visualize emotional trends over time, correlating mood states with writing volume.",
  },
  {
    icon: Sparkles,
    title: "Longitudinal Insights & Dashboards",
    body: "A visual analytical dashboard tracking word counts, writing velocity, recurring themes, and cognitive-analysis summaries across weeks and months.",
  },
  {
    icon: Lock,
    title: "Row-Level Database Security (RLS)",
    body: "Every entry is cryptographically scoped to your authenticated account ID at the PostgreSQL kernel level. No engineer or external user can access your writing.",
  },
  {
    icon: ShieldCheck,
    title: "Cognitive Recall & Language Games",
    body: "Gentle word association and vocabulary games designed to stimulate lexical recall — serving as an enjoyable companion to reflective journaling.",
  },
  {
    icon: Star,
    title: "Customizable Paper & Typography Themes",
    body: "Choose from six tactile paper textures (plain, ruled, grid, parchment, slate, sepia) and bespoke typography styles that evoke your favorite physical notebook.",
  },
  {
    icon: Cpu,
    title: "Ephemeral Cloudflare Edge Inference",
    body: "AI analysis runs server-side in ephemeral RAM on Cloudflare Workers AI. Raw audio and prompt tokens are purged immediately following response delivery.",
  },
];

const LINGUISTIC_PILLARS = [
  {
    title: "Type-Token Ratio (Lexical Diversity)",
    summary:
      "TTR calculates the ratio of unique vocabulary words against total word count. High diversity indicates rich semantic exploration, while contractions or repetitions can signal fatigue or intense topical focus.",
  },
  {
    title: "Syntactic Cadence & Clause Structure",
    summary:
      "Analyzing clause length, subordination, and sentence transitions reveals working-memory cognitive ease versus rushed executive processing.",
  },
  {
    title: "Affective Granularity & Emotional Lexicon",
    summary:
      "Tracking the nuances of emotional adjectives (e.g. distinguishing between 'overwhelmed' and 'disheartened') reflects self-awareness and emotional regulation.",
  },
  {
    title: "Self-Referential Baseline vs Population Grading",
    summary:
      "Instead of comparing you to arbitrary population averages, NeuroMirror benchmarks your writing solely against your own historical baseline.",
  },
];

const VALUES = [
  {
    title: "Privacy as a Fundamental Right",
    body: "Inner thoughts require absolute sanctity. Every architectural choice begins with the mandate of cryptographic isolation and zero secondary data monetization.",
  },
  {
    title: "Clarity Over Pseudo-Clinical Claims",
    body: "We refuse to sensationalize AI. We never assign clinical scores, percentile rankings, or pseudo-medical diagnoses. We present clear, observable patterns.",
  },
  {
    title: "Writing as a Keystone Cognitive Practice",
    body: "Putting abstract feelings into structured sentences engages frontal and temporal neural networks. Writing is the foundation of mental clarity.",
  },
  {
    title: "Data Sovereignty & User Portability",
    body: "You own 100% of your writing. We will never lock your memories away, train external models on your entries, or restrict your ability to delete your data.",
  },
];

export default function About() {
  return (
    <>
      <AdSenseLoader />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
            Home
          </Link>
          <Link href="/blog" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
            Blog
          </Link>
          <Link href="/terms" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
            Terms
          </Link>
          <Link href="/privacy" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
            Privacy
          </Link>
          <ThemeSwitch compact />
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            Start Free
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-12 sm:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Our Mission & Science</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-ink sm:text-6xl">
            A journal that serves as a mirror to your mind.
          </h1>
          <p className="mt-7 max-w-3xl font-serif text-xl leading-relaxed text-ink-2">
            NeuroMirror is a private digital journal engineered for writing-led cognitive health
            reflection. By uniting distraction-free journaling, voice transcription, and ethical
            linguistic-pattern analysis, we empower individuals and families to preserve memories
            and notice how their expressive patterns evolve over time.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:opacity-90"
            >
              Start Journaling Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-line-2 px-6 py-3 text-sm text-ink hover:bg-paper-2"
            >
              Explore Our Research Blog
            </Link>
          </div>
        </section>

        {/* AdSense Unit */}
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <AdSenseUnit slot="about-page-top" />
        </div>

        {/* Origin Story Section */}
        <section className="border-y border-line bg-paper-2/60">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Origin Story</p>
            <h2 className="mt-4 font-display text-4xl text-ink">Why NeuroMirror was created</h2>
            <div className="mt-8 space-y-6 font-serif text-lg leading-relaxed text-ink-2">
              <p>
                NeuroMirror began with a deeply personal journey. Watching a close family member
                experience subtle, gradual shifts in expressive vocabulary, working memory, and
                conversational recall highlighted an acute gap in everyday software tools.
              </p>
              <p>
                Existing journal applications treated writing as passive digital scrapbooks —
                offering no insight into the rich cognitive patterns woven into our sentences. On the
                opposite end of the spectrum, emerging medical apps attempted to reduce human
                cognition to cold percentage scores, alarming users with pseudo-clinical risk
                assessments based on arbitrary algorithms.
              </p>
              <p>
                We envisioned a principled third path: a serene, beautiful writing sanctuary that
                acts as a true mirror. A platform that provides thoughtful, non-diagnostic
                observations about your vocabulary breadth, sentence cadence, and emotional
                themes — <em>only when you ask for it</em>, and never to diagnose or judge.
              </p>
              <p>
                The name <strong>&ldquo;NeuroMirror&rdquo;</strong> signifies this vision: using your
                own written and spoken words as an authentic reflection of your ongoing mental
                vitality, helping you cherish memories and reflect on your cognitive journey with
                peace of mind.
              </p>
            </div>
          </div>
        </section>

        {/* The Cognitive Linguistic Framework */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">The Science</p>
            <h2 className="mt-4 font-display text-4xl text-ink">
              The Cognitive-Linguistic Framework
            </h2>
            <p className="mt-4 font-serif text-lg leading-relaxed text-ink-2">
              Human language is deeply tied to executive function, working memory, and affective
              processing. NeuroMirror analyzes four observable linguistic dimensions:
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {LINGUISTIC_PILLARS.map((pillar, i) => (
              <div key={pillar.title} className="rounded-xl border border-line bg-card p-7">
                <span className="font-mono text-xs text-accent">0{i + 1} / FOUNDATION</span>
                <h3 className="mt-3 font-display text-xl text-ink">{pillar.title}</h3>
                <p className="mt-3 font-serif text-base leading-relaxed text-ink-2">
                  {pillar.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-line bg-paper-2/40">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Features</p>
            <h2 className="mt-4 font-display text-4xl text-ink">Everything in one private haven</h2>
            <p className="mt-4 max-w-2xl text-ink-2">
              Combining distraction-free writing, voice dictation, freeform drawing, and memory
              indexing in a unified, privacy-first interface.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-line bg-card p-6">
                  <Icon className="h-6 w-6 text-accent" aria-hidden />
                  <h3 className="mt-3 font-display text-lg text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="border-y border-line">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Our Principles</p>
            <h2 className="mt-4 font-display text-4xl text-ink">Core Values That Guide Us</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {VALUES.map(({ title, body }) => (
                <div key={title} className="rounded-xl border border-line bg-card p-6">
                  <h3 className="font-display text-xl text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Zero-Knowledge Architecture */}
        <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink-3">
            <ShieldCheck className="h-4 w-4 text-accent" /> Architecture
          </div>
          <h2 className="mt-4 font-display text-4xl text-ink">How we safeguard your words</h2>
          <div className="mt-8 space-y-6 font-serif text-lg leading-relaxed text-ink-2">
            <p>
              Your journal entries are among the most intimate documents in existence. We built
              NeuroMirror around three uncompromising technical safeguards:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-base">
              <li>
                <strong>PostgreSQL Row-Level Security:</strong> Database policies mandate that every
                row in <code>journals</code>, <code>notes</code>, and <code>cognitive_insights</code>{" "}
                is cryptographically bound to your specific Supabase user UUID. No public API or
                administrative script can bypass this isolation.
              </li>
              <li>
                <strong>Ephemeral Serverless Execution:</strong> When an entry is analyzed or a
                voice recording is transcribed, execution occurs in an ephemeral Cloudflare Workers
                AI container. Audio files and prompts are processed strictly in RAM and purged
                immediately upon completion.
              </li>
              <li>
                <strong>Zero Training Guarantee:</strong> We hold an absolute policy: your private
                journal entries are never fed into foundation model training corpora, never shared
                with data brokers, and never utilized for ad targeting.
              </li>
            </ul>
          </div>
        </section>

        {/* Medical & Regulatory Disclaimer */}
        <section className="border-t border-line bg-paper-2/60">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
            <div className="rounded-xl border border-amber/50 bg-amber/10 p-8">
              <h2 className="font-display text-2xl text-ink">
                Ethical Stance: What NeuroMirror is Not
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-2">
                <p>
                  NeuroMirror is <strong className="text-ink">not a medical device</strong>, is not
                  certified by the FDA or medical authorities, and does not diagnose, screen, treat,
                  or monitor any cognitive condition, dementia, or neurological illness.
                </p>
                <p>
                  Linguistic variation naturally occurs due to everyday fatigue, stress, mood, or
                  hurried writing. These variations are normal and do not indicate pathology.
                </p>
                <p>
                  If you or a loved one have concerns regarding memory, executive function, or
                  cognitive health, always seek guidance from a qualified physician, neurologist, or
                  neuropsychologist. NeuroMirror is a peaceful personal journal and reflective
                  companion, not clinical medicine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact and Investor Inquiry Section */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Get in Touch</p>
            <h2 className="mt-4 font-display text-4xl text-ink">Contact & Partnerships</h2>
            <p className="mt-4 font-serif text-lg leading-relaxed text-ink-2">
              Whether you are an active journal writer, a researcher in cognitive linguistics, or an
              investor interested in digital wellness and memory preservation, we welcome your
              inquiries.
            </p>
            <div className="mt-6 space-y-2 text-sm text-ink-2">
              <p>
                General & Support:{" "}
                <a
                  href="mailto:contact@neuromirror.in"
                  className="text-accent underline underline-offset-4"
                >
                  contact@neuromirror.in
                </a>
              </p>
              <p>
                Partnerships & Inquiries:{" "}
                <a
                  href="mailto:contact@neuromirror.in?subject=Partnership%20Inquiry"
                  className="text-accent underline underline-offset-4"
                >
                  contact@neuromirror.in
                </a>
              </p>
              <p>
                Platform Website:{" "}
                <a href={SITE.url} className="text-accent underline underline-offset-4">
                  {SITE.url}
                </a>
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper"
              >
                Create Your Account Free
              </Link>
              <Link
                href="/terms"
                className="rounded-full border border-line-2 px-6 py-3 text-sm text-ink hover:bg-paper-2"
              >
                Read Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="rounded-full border border-line-2 px-6 py-3 text-sm text-ink hover:bg-paper-2"
              >
                Read Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed">
            NeuroMirror provides informational writing observations only. Not a medical device. ©{" "}
            {new Date().getFullYear()} NeuroMirror.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
