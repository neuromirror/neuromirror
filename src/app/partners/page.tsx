import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { SITE } from "@/lib/site";
import {
  TrendingUp,
  ShieldCheck,
  Brain,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RefreshCw,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Audit & Due Diligence – NeuroMirror",
  description:
    "An investor-grade due-diligence audit of NeuroMirror. Review architectural weaknesses identified, security loopholes fixed, 100% free access model, and data sovereignty safeguards.",
  alternates: { canonical: "/partners" },
};

const STATS = [
  { value: "100% Free", label: "Zero Subscriptions, Paywalls, or Gated Features" },
  { value: "100%", label: "PostgreSQL Row-Level Security (RLS) Isolation" },
  { value: "0", label: "User Journals Used for Public AI Model Training" },
  { value: "1-Click", label: "Complete Data Portability (JSON & Markdown Export)" },
];

const AUDIT_FIXES = [
  {
    icon: Zap,
    title: "Vulnerability 1: TOCTOU Concurrency Race Conditions",
    weakness:
      "Parallel API requests could flood edge functions simultaneously before database counts updated, bypassing hourly quotas and burning external inference compute.",
    remediation:
      "Implemented PostgreSQL transactional advisory locking (`pg_advisory_xact_lock`) on the user UUID hash and an atomic pre-claim reservation ledger (`cognitive_analysis_requests`) that deducts quota before invoking Cloudflare AI.",
    status: "Hardened & Enforced",
  },
  {
    icon: Database,
    title: "Vulnerability 2: Vendor Lock-in & GDPR Portability Risk",
    weakness:
      "Lack of self-service data export created switching friction, legal risk under GDPR Article 20, and user hesitation to commit personal entries.",
    remediation:
      "Engineered a 1-click self-service Data Manager in Settings allowing instant export to structured JSON and readable Markdown (.md), plus verified self-service data erasure.",
    status: "Implemented & Verified",
  },
  {
    icon: ShieldCheck,
    title: "Vulnerability 3: Regulatory & Medical Device Liability",
    weakness:
      "Ambiguous language in AI health apps risks triggering FDA 510(k) medical device classification or user anxiety over false clinical diagnoses.",
    remediation:
      "Enforced a strict non-diagnostic cognitive linguistic model: no clinical scores, no risk probabilities. Framing is strictly focused on observable writing patterns for mindful self-reflection.",
    status: "Compliant & De-risked",
  },
  {
    icon: RefreshCw,
    title: "Vulnerability 4: AI Provider Downtime & Single-Point-of-Failure",
    weakness:
      "Reliance on third-party serverless inference could leave the user stranded with a broken UI if the model API is rate-limited or offline.",
    remediation:
      "Built resilient tiered fallbacks: local in-browser heuristic linguistic analysis (`analyzeWritingLocally`) and native Web Speech API dictation when cloud Whisper is unreachable.",
    status: "Resilient & Offline-Ready",
  },
  {
    icon: Cpu,
    title: "Vulnerability 5: Prompt Delimiter & Unbounded Payload Injection",
    weakness:
      "Unsanitized journal text sent to LLM endpoints could permit prompt leakage, delimiter injection, or excessive compute denial-of-service.",
    remediation:
      "Enforced strict 20,000-character payload bounds, stripped invisible ASCII control sequences, and isolated user text in structured JSON parameter blocks.",
    status: "Sanitized & Guarded",
  },
  {
    icon: Brain,
    title: "Vulnerability 6: Cold-Start Writer's Block & Day-1 Churn",
    weakness:
      "Users entering a completely empty journal stare at a blank screen, leading to high initial drop-off before personal baselines can be established.",
    remediation:
      "Integrated structured cognitive prompts (sensory grounding, episodic memory, emotional reframing) directly into the editor for 1-click inspiration.",
    status: "Integrated in Editor",
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
          <Link href="/terms" className="text-sm text-ink-2 hover:text-ink">
            Terms
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
            <TrendingUp className="h-4 w-4" /> Due Diligence & Technical Audit
          </div>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl lg:text-6xl leading-tight">
            Fixing weaknesses to build an enduring platform.
          </h1>
          <p className="mt-6 font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
            A thorough technical and product audit of NeuroMirror. We systematically identified the
            operational, architectural, and security vulnerabilities of our site and engineered
            comprehensive solutions to resolve them.
          </p>
        </section>

        {/* Metrics Grid */}
        <section className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-card p-6 text-center">
              <p className="font-display text-3xl font-semibold text-ink sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-xs text-ink-3">{s.label}</p>
            </div>
          ))}
        </section>

        {/* 100% Free Philosophy */}
        <section className="mt-16 rounded-xl border border-line bg-paper-2/60 p-8 sm:p-12">
          <h2 className="font-display text-3xl text-ink">Why NeuroMirror is 100% Free</h2>
          <div className="mt-6 space-y-4 font-serif text-base text-ink-2 leading-relaxed">
            <p>
              We believe cognitive health journaling should never be locked behind subscriptions,
              paywalls, or credit card requirements. Mental self-reflection and personal memory
              preservation are fundamental human needs.
            </p>
            <p>
              <strong>The Sustainable Model:</strong> NeuroMirror sustains its infrastructure purely
              through non-intrusive Google AdSense advertising on public educational articles and
              guides. All private app features—dated journals, Memory Vault, voice dictation, canvas
              drawing, and cognitive linguistic observations—remain <strong>100% free</strong> for
              every user.
            </p>
          </div>
        </section>

        {/* Technical Audit & Weaknesses Fixed */}
        <section className="mt-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Architectural Hardening</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Platform Weaknesses Identified & Remediated
            </h2>
            <p className="mt-3 text-sm text-ink-2">
              Every system vulnerability and UX friction point identified during our due diligence
              review has been engineered and deployed to production.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {AUDIT_FIXES.map((fix) => {
              const Icon = fix.icon;
              return (
                <div key={fix.title} className="rounded-xl border border-line bg-card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-accent" />
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                        {fix.status}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg text-ink">{fix.title}</h3>
                    <div className="mt-3 space-y-2 text-xs leading-relaxed">
                      <p className="text-ink-3">
                        <strong className="text-clay">Identified Weakness:</strong> {fix.weakness}
                      </p>
                      <p className="text-ink-2 font-serif text-sm">
                        <strong className="text-accent font-sans text-xs">Engineered Fix:</strong>{" "}
                        {fix.remediation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Research Collaboration Section */}
        <section className="mt-20 border-t border-line pt-16">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ink-3">Open Collaboration</p>
              <h2 className="mt-3 font-display text-3xl text-ink">
                Academic & Clinical Inquiries
              </h2>
              <p className="mt-4 font-serif text-base leading-relaxed text-ink-2">
                We welcome inquiries from cognitive linguistics departments, memory clinics, and
                digital health researchers studying writing-led cognitive longevity.
              </p>
              <div className="mt-6 space-y-2 text-sm text-ink-2">
                <p>
                  <strong>Contact:</strong>{" "}
                  <a
                    href="mailto:contact@neuromirror.in"
                    className="text-accent underline underline-offset-4"
                  >
                    contact@neuromirror.in
                  </a>
                </p>
                <p>
                  <strong>Location:</strong> Bengaluru, India · Cloudflare Global Edge
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-card p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-accent" />
              <h3 className="mt-4 font-display text-xl text-ink">Experience NeuroMirror</h3>
              <p className="mt-2 text-xs text-ink-2 font-serif">
                A private, hardened, 100% free journal built around cognitive-language awareness.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-medium text-paper hover:opacity-90"
              >
                Create Free Journal Account <ArrowRight className="h-3.5 w-3.5" />
              </Link>
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
              Platform Audit
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
