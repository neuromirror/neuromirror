import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { SITE } from "@/lib/site";
import {
  TrendingUp,
  ShieldCheck,
  Brain,
  Users,
  Lock,
  ArrowRight,
  Database,
  BarChart3,
  Globe,
  FileSpreadsheet,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Investors & Partners – NeuroMirror",
  description:
    "Explore the NeuroMirror investment thesis, market opportunity in cognitive health longevity, multi-tiered monetization, and clinical research partnership opportunities.",
  alternates: { canonical: "/partners" },
};

const STATS = [
  { value: "$15.8B", label: "Projected Cognitive Longevity & Wellness Market by 2030" },
  { value: "100%", label: "Private PostgreSQL Row-Level Security (RLS) Isolation" },
  { value: "0", label: "Zero Public AI Training on Sensitive User Journals" },
  { value: "3 Tiers", label: "Diversified Revenue: AdSense, Pro SaaS, and Family Plans" },
];

const MONETIZATION_TIERS = [
  {
    name: "Free & AdSense Supported",
    price: "$0",
    description: "Public educational content, blog, and standard private journaling.",
    features: [
      "Distraction-free rich journal & note editor",
      "Instant Memory Vault keyword search",
      "Tactile paper styles and theme customization",
      "Monetized via Google AdSense on public editorial pages",
    ],
    highlight: false,
  },
  {
    name: "NeuroMirror Pro",
    price: "$9.99 / mo",
    description: "For active self-reflectors and individuals tracking personal cognitive baselines.",
    features: [
      "Expanded Cloudflare Workers AI cognitive observations",
      "Full Whisper voice journaling transcription",
      "Longitudinal lexical diversity & syntactic trend curves",
      "Exportable Clinical PDF summary packets for doctor visits",
      "Custom introspective reflection prompt library",
    ],
    highlight: true,
  },
  {
    name: "Family & Caregiver Circle",
    price: "$19.99 / mo",
    description: "Generational memory preservation for families and assisted living.",
    features: [
      "Shared family memory vault with permission controls",
      "Oral history voice recording and automated archival",
      "Collaborative life chapters and heirloom export",
      "Caregiver observation digest with consent scoping",
    ],
    highlight: false,
  },
];

export default function PartnersPage() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-ink-2 hover:text-ink">
            Home
          </Link>
          <Link href="/about" className="text-sm text-ink-2 hover:text-ink">
            About
          </Link>
          <Link href="/blog" className="text-sm text-ink-2 hover:text-ink">
            Blog
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

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        {/* Hero */}
        <section className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            <TrendingUp className="h-4 w-4" /> Investor & Partner Overview
          </div>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl lg:text-6xl leading-tight">
            The future of cognitive longevity starts with daily reflection.
          </h1>
          <p className="mt-6 font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
            NeuroMirror is building the definitive writing-led cognitive wellness platform. By
            combining private daily journaling with longitudinal computational linguistics, we
            create an enduring personal baseline for human cognition.
          </p>
        </section>

        {/* Key Metrics / Highlights Grid */}
        <section className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-card p-6 text-center">
              <p className="font-display text-3xl font-semibold text-ink sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-xs text-ink-3">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Investment Thesis */}
        <section className="mt-16 rounded-xl border border-line bg-paper-2/60 p-8 sm:p-12">
          <h2 className="font-display text-3xl text-ink">The Investment Thesis</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-display text-lg text-ink flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" /> Massive Demographic Tailwinds
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2 font-serif">
                Over 55 million people worldwide live with cognitive changes, projected to reach 139
                million by 2050. Proactive self-monitoring and memory preservation are moving from
                niche wellness to mainstream healthcare priorities.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-ink flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" /> Zero Regulatory Friction
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2 font-serif">
                By intentionally positioning NeuroMirror as an informational, non-diagnostic
                reflective companion, we avoid protracted FDA 510(k) medical device clearance cycles
                while maintaining complete consumer trust and high organic adoption.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-ink flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" /> Unmatched Data Moat & Retention
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2 font-serif">
                A user&apos;s personal baseline becomes exponentially more valuable with each passing
                month. Switching costs grow organically, establishing industry-leading retention
                and lifetime value (LTV).
              </p>
            </div>
          </div>
        </section>

        {/* Business Model & Monetization Tiers */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Unit Economics</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Scalable, High-Margin Monetization
            </h2>
            <p className="mt-3 text-sm text-ink-2">
              A balanced revenue model blending immediate ad-supported traffic monetization with
              recurring high-margin SaaS subscriptions.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {MONETIZATION_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border p-7 flex flex-col justify-between ${
                  tier.highlight
                    ? "border-accent bg-card shadow-soft ring-1 ring-accent"
                    : "border-line bg-card"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Primary Growth Driver
                  </span>
                )}
                <div>
                  <h3 className="font-display text-xl text-ink">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-3xl text-ink font-semibold">
                      {tier.price}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-ink-2">{tier.description}</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-ink-2">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <span className="text-accent font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research & Clinical Collaboration */}
        <section className="mt-20 border-t border-line pt-16">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Academic Partnerships</p>
              <h2 className="mt-3 font-display text-3xl text-ink">
                Clinical Research & University Collaborations
              </h2>
              <p className="mt-4 font-serif text-base leading-relaxed text-ink-2">
                We actively collaborate with cognitive neurology departments, psycholinguistics labs,
                and digital health researchers investigating early linguistic indicators of
                executive changes.
              </p>
              <p className="mt-3 font-serif text-base leading-relaxed text-ink-2">
                Our infrastructure provides aggregated, strictly anonymized linguistic telemetry
                with explicit participant consent — accelerating longitudinal research without
                compromising individual privacy.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-card p-8">
              <h3 className="font-display text-xl text-ink">Inquire for Collaboration</h3>
              <p className="mt-2 text-xs text-ink-2">
                For angel investors, institutional venture funds, and academic research inquiries:
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <p>
                  <strong>Executive Contact:</strong>{" "}
                  <a
                    href="mailto:contact@neuromirror.in?subject=Investor%20%2F%20Partner%20Inquiry"
                    className="text-accent underline underline-offset-4"
                  >
                    contact@neuromirror.in
                  </a>
                </p>
                <p>
                  <strong>Location:</strong> Bengaluru, India · Global Cloud Infrastructure
                </p>
              </div>
              <a
                href="mailto:contact@neuromirror.in?subject=Investor%20%2F%20Partner%20Inquiry"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-medium text-paper hover:opacity-90"
              >
                Request Investor Deck & Data Room <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line mt-24">
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
            <Link href="/partners" className="hover:text-ink">
              Investors
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
