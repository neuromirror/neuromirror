import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Lock, NotebookPen, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { FAQ } from "@/lib/content/faq";
import { SITE } from "@/lib/site";
import { AdSenseLoader } from "@/components/adsense-loader";

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: "/" },
  keywords: [
    "digital journal",
    "private journal",
    "online journaling",
    "personal memory journal",
    "journal app",
    "digital diary",
    "self reflection journal",
    "personal memory archive",
    "cognitive awareness",
  ],
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: { card: "summary", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
};

const STEPS = [
  { n: "01", title: "Write", body: "Write a dated journal or capture a quick note. Autosave keeps every word." },
  { n: "02", title: "Organize", body: "Use dates, tags, notebooks, favorites, and a calendar that follows your journals." },
  { n: "03", title: "Remember", body: "Ask Memory Vault in your own words and rediscover something you wrote long ago." },
  { n: "04", title: "Track patterns", body: "Compare requested writing observations over time, with no scores or diagnoses." },
];

const AUDIENCE = [
  { title: "Regular journal writers", body: "You already write and want better organization and a way to find old entries." },
  { title: "People moving from paper", body: "You want a private digital notebook that is searchable and does not get lost." },
  { title: "Self-reflectors", body: "You want to notice recurring themes and how your thinking changes over the years." },
  { title: "Memory keepers", body: "You want to preserve meaningful moments and find them again with a simple question." },
  { title: "Older adults and families", body: "You want a long-term written record of personal memories and everyday life." },
  { title: "Caregivers, with permission", body: "Organized writing over time can help support conversations about cognitive changes." },
];

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/favicon.svg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: SITE.name,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      url: SITE.url,
      description:
        "A private digital journal with dated journals, notes with optional deadlines, a journal calendar, natural-language memory search (Memory Vault), optional AI reflections, and non-diagnostic cognitive-language insights.",
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function HeroPage() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="absolute -right-3 top-6 hidden h-full w-full rotate-[2.5deg] rounded-lg border border-line bg-paper-2 lg:block" />
      <div className="relative rounded-lg border border-line bg-card p-7 shadow-soft sm:p-9">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-3">Your space</p>
        <h3 className="mt-3 font-display text-2xl text-ink">Start with what’s on your mind.</h3>
        <p className="mt-3 font-serif text-lg leading-relaxed text-ink-2">A little room for thoughts worth keeping.</p>
        <div className="mt-5 rounded-md border border-line bg-paper p-4">
          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-ink-3">Illustrative journal excerpt</p>
          <p className="mt-2 font-serif text-[1.02rem] italic leading-relaxed text-ink-2">“The rain softened the afternoon. I finally had time to notice how quiet the house gets after lunch.”</p>
          <p className="mt-2 text-[0.68rem] text-ink-3">Example text only · never saved to an account</p>
        </div>
        <div className="mt-6 space-y-2 border-t border-line pt-5">
          {[["Write", "Dated journals and quick notes"], ["Return", "Your own writing, searchable and organized"], ["Reflect", "Optional language observations when you ask"]].map(([title, description]) => (
            <div key={title} className="flex items-center justify-between gap-3 rounded-md bg-paper-2 px-3 py-2.5">
              <span className="text-sm font-medium text-ink">{title}</span><span className="text-right text-xs text-ink-3">{description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      <AdSenseLoader />
      <JsonLd />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-5">
          <a href="#about" className="hidden text-sm text-ink-2 hover:text-ink md:inline">About</a>
          <a href="#how-it-works" className="hidden text-sm text-ink-2 hover:text-ink md:inline">How it works</a>
          <a href="#privacy" className="hidden text-sm text-ink-2 hover:text-ink md:inline">Privacy</a>
          <a href="#faq" className="hidden text-sm text-ink-2 hover:text-ink md:inline">FAQ</a>
          <span className="hidden sm:inline"><ThemeSwitch compact /></span>
          <Link href="/signin" className="rounded-full px-3 py-2 text-sm text-ink hover:bg-paper-2">Sign In</Link>
        </nav>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
          <div>
            <p className="rise text-xs uppercase tracking-[0.22em] text-ink-3">Writing-led cognitive health awareness</p>
            <h1 className="rise rise-1 mt-5 font-display text-5xl leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              NeuroMirror
            </h1>
            <p className="rise rise-2 mt-4 font-display text-2xl italic text-accent sm:text-3xl">{SITE.tagline}</p>
            <p className="rise rise-3 mt-7 max-w-xl font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
              A private way to notice how your writing changes over time. Choose journal entries for careful, non-diagnostic
              cognitive-language reflections, then keep your notes, memories, and everyday writing together.
            </p>
            <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:-translate-y-px">
                Get Started <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/signin" className="rounded-full border border-line-2 px-6 py-3 text-sm text-ink hover:bg-paper-2">
                Sign In
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-ink-3">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Free · No email verification · Private to your account
            </p>
          </div>
          <HeroPage />
        </section>

        {/* About */}
        <section id="about" aria-labelledby="about-h" className="border-y border-line bg-paper-2/60">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ink-3">About</p>
              <h2 id="about-h" className="mt-4 font-display text-4xl leading-tight text-ink">What is NeuroMirror?</h2>
            </div>
            <div className="space-y-5 font-serif text-lg leading-relaxed text-ink-2">
              <p>
                <strong className="font-medium text-ink">NeuroMirror helps you reflect on cognitive health through your own writing.</strong>{" "}
                Request language-pattern observations for selected journal entries and build a personal record over time,
                while keeping notebooks, everyday notes, Memory Vault, and games in the same private space.
              </p>
              <p>
                It is designed for people who want to write, preserve memories, organize their thoughts, revisit past entries,
                and better understand their own writing and cognitive well-being over time. Cognitive awareness, including
                interest in memory and cognitive change, is one important use, but NeuroMirror is first a place to write.
              </p>
              <ul className="grid gap-x-8 gap-y-3 pt-3 font-sans text-[0.95rem] sm:grid-cols-2">
                {[
                  [NotebookPen, "Journals with dates, and notes without them"],
                  [CalendarDays, "A calendar driven by your journal dates"],
                  [Search, "Memory Vault: search your memories in plain language"],
                  [Sparkles, "Optional AI reflection that never overwrites you"],
                ].map(([Icon, text]) => {
                  const I = Icon as typeof Search;
                  return (
                    <li key={text as string} className="flex items-start gap-3 text-ink">
                      <I className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      {text as string}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-h" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-3">How it works</p>
          <h2 id="how-h" className="mt-4 max-w-2xl font-display text-4xl leading-tight text-ink">
            How does NeuroMirror work?
          </h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="bg-paper p-7">
                <span className="font-display text-sm text-clay">{s.n}</span>
                <h3 className="mt-6 font-display text-2xl text-ink">{s.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Memory Vault explainer */}
        <section aria-labelledby="vault-h" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="grid gap-10 rounded-lg border border-line bg-card p-8 shadow-soft sm:p-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Memory Vault</p>
              <h2 id="vault-h" className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
                What is Memory Vault?
              </h2>
              <p className="mt-5 font-serif text-lg leading-relaxed text-ink-2">
                Memory Vault is where you find things you wrote before, without remembering the exact words. Ask a question like
                you would ask a friend, and it looks only through <em>your own</em> journals.
              </p>
            </div>
            <ul className="space-y-4 text-[0.95rem] leading-relaxed text-ink-2">
              <li><strong className="font-medium text-ink">Real entries only.</strong> Every result links to a journal you wrote, with its real date and an excerpt quoted from your text.</li>
              <li><strong className="font-medium text-ink">Honest when empty.</strong> If nothing matches, it says “I couldn’t find a matching memory in your journals.”</li>
              <li><strong className="font-medium text-ink">Minimal AI context.</strong> Your journals are narrowed down first. Only a few candidate entries are sent to the AI to rank.</li>
              <li><strong className="font-medium text-ink">More ways to remember.</strong> Filters, a memory timeline, On This Day, and saved memories.</li>
            </ul>
          </div>
        </section>

        {/* Audience */}
        <section aria-labelledby="who-h" className="border-y border-line bg-paper-2/60">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Who it’s for</p>
            <h2 id="who-h" className="mt-4 font-display text-4xl text-ink">Who is NeuroMirror for?</h2>
            <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCE.map((a) => (
                <div key={a.title} className="border-t border-line-2 pt-5">
                  <h3 className="font-display text-xl text-ink">{a.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{a.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 max-w-3xl text-sm leading-relaxed text-ink-3">
              NeuroMirror never independently diagnoses dementia or any other condition. It can help you keep an organized record
              you may choose to share with family or a healthcare professional.
            </p>
          </div>
        </section>

        {/* Privacy + what we don't claim */}
        <section id="privacy" aria-labelledby="privacy-h" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <div>
            <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />
            <h2 id="privacy-h" className="mt-5 font-display text-3xl text-ink">How NeuroMirror protects your privacy</h2>
            <ul className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-ink-2">
              <li>Journals and notes are private to your account, protected by authenticated access and database-level security rules.</li>
              <li>There are no public journal pages, and private pages are never indexed by search engines.</li>
              <li>AI runs only when you ask, from our server, with only the text the feature needs.</li>
              <li>You can export your data or permanently delete your account at any time.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line p-8">
            <h2 className="font-display text-3xl text-ink">What NeuroMirror does not claim</h2>
            <ul className="mt-6 space-y-3 text-[0.95rem] leading-relaxed text-ink-2">
              <li>It is not a medical device and does not diagnose dementia or any condition.</li>
              <li>Cognitive-language insights are informational observations, never probabilities or verdicts.</li>
              <li>Ordinary changes in writing are normal and do not by themselves indicate illness.</li>
              <li>Voice analysis is coming soon and is not available yet.</li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-h" className="border-t border-line">
          <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">FAQ</p>
            <h2 id="faq-h" className="mt-4 font-display text-4xl text-ink">Questions, answered plainly</h2>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg text-ink">
                    <h3>{f.q}</h3>
                    <span aria-hidden className="text-ink-3 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 pr-8 leading-relaxed text-ink-2">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="rounded-lg bg-ink px-8 py-16 text-center text-paper sm:px-16">
            <h2 className="font-display text-4xl">Your story starts here.</h2>
            <p className="mx-auto mt-4 max-w-lg font-serif text-lg opacity-80">
              Write something today. Find it again whenever you need it.
            </p>
            <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink">
              Get Started <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed">
            NeuroMirror provides informational writing observations only. It is not a medical device and does not diagnose,
            treat, or prevent any condition. © {new Date().getFullYear()} NeuroMirror.
          </p>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
        </div>
      </footer>
    </>
  );
}
