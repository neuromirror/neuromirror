import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { SITE } from "@/lib/site";
import { ShieldCheck, AlertTriangle, FileText, Lock, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions – NeuroMirror",
  description:
    "Terms and Conditions of Service for NeuroMirror. Understand our acceptable use, privacy protections, non-diagnostic disclaimers, usage limits, and user content rights.",
  alternates: { canonical: "/terms" },
};

const EFFECTIVE_DATE = "24 October 2026";
const CONTACT_EMAIL = "contact@neuromirror.in";

export default function TermsAndConditions() {
  return (
    <>
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
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
          <Link href="/privacy" className="text-sm text-ink-2 hover:text-ink">
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

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-3">
          <Scale className="h-4 w-4 text-accent" /> Legal Agreement
        </div>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-ink-3">
          Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {EFFECTIVE_DATE}
        </p>

        <p className="mt-6 font-serif text-lg leading-relaxed text-ink-2">
          These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of{" "}
          <strong className="text-ink">neuromirror.in</strong> (the &ldquo;Service&rdquo;), operated
          by NeuroMirror (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By creating an
          account or accessing any part of the Service, you agree to be bound by these Terms.
        </p>

        {/* Highlighted Warning Box */}
        <div className="mt-8 rounded-xl border border-amber/50 bg-amber/10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber" />
            <div className="text-sm leading-relaxed text-ink">
              <strong className="font-semibold block text-base mb-1">
                Important Medical & Non-Diagnostic Notice
              </strong>
              NeuroMirror is an informational digital journal and self-reflection application. It is{" "}
              <strong>NOT a medical device</strong>, diagnostic screening tool, or clinical
              assessment. Observations regarding vocabulary, sentence structure, or tone are for
              personal curiosity and self-reflection only and must never be interpreted as medical
              verdicts, disease detection, or clinical advice.
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="font-display text-2xl text-ink">1. Acceptance & Eligibility</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                By registering for an account or using NeuroMirror, you represent that you are at
                least 18 years of age (or have reached the age of majority in your jurisdiction), or
                have explicit permission and supervision from a legal guardian.
              </p>
              <p>
                If you do not agree to these Terms, you must discontinue use of the Service
                immediately.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-display text-2xl text-ink">2. User Accounts & Security</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                To use private features (including journal writing, memory vault search, voice
                transcription, and cognitive reflections), you must register an account via email
                and password or authorized Google sign-in.
              </p>
              <p>
                You are responsible for safeguarding your login credentials. You must notify us
                promptly at <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">{CONTACT_EMAIL}</a> if you
                suspect unauthorized access to your account.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-display text-2xl text-ink">
              3. Ownership of User Content & Privacy Guarantee
            </h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                <strong>You retain 100% of all intellectual property rights and ownership</strong>{" "}
                over your journals, notes, audio recordings, canvas drawings, and reflections
                (&ldquo;User Content&rdquo;).
              </p>
              <p>
                NeuroMirror claims no ownership rights over your User Content. We store and process
                your User Content solely to provide the Service to you.
              </p>
              <p>
                <strong>No Public Model Training:</strong> We guarantee that your private journal
                entries, voice transcripts, and notes are <em>never sold</em> to third parties and{" "}
                <em>never used to train public generative AI foundation models</em>.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-2xl text-ink">
              4. Fair Usage Limits & Anti-Abuse Rules
            </h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                To guarantee equal availability, safeguard server resources, and prevent malicious
                depletion of serverless inference costs, the following strict usage caps apply:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cognitive-Language Analysis:</strong> Limited to a maximum of{" "}
                  <strong>10 analysis requests per calendar hour</strong> per authenticated user
                  account.
                </li>
                <li>
                  <strong>Voice Transcription:</strong> Limited to a maximum of{" "}
                  <strong>10 audio transcriptions per calendar hour</strong> per authenticated user
                  account, with a maximum file size of 10 MB and supported formats only.
                </li>
                <li>
                  <strong>Journal Character Length:</strong> A single entry submitted for AI
                  analysis cannot exceed 20,000 characters.
                </li>
              </ul>
              <p className="mt-4">
                <strong>Prohibited Conduct:</strong> You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Attempt to circumvent or evade rate limits through concurrent API requests,
                  scripting, or creating multiple accounts.
                </li>
                <li>
                  Inject adversarial prompt attacks, malicious code, or automated scrapers into the
                  platform or its Edge Functions.
                </li>
                <li>
                  Reverse-engineer, decompile, or launch denial-of-service (DoS) attacks against our
                  infrastructure.
                </li>
              </ul>
              <p>
                Violating fair usage limits or engaging in abusive automated attacks will result in
                immediate automated rate-limiting, IP blocking, or permanent account termination.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-2xl text-ink">5. Third-Party Services & AI Subprocessors</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                The Service integrates reputable third-party infrastructure to deliver specific
                capabilities:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Supabase:</strong> Provides authenticated session management and
                  PostgreSQL database hosting protected by Row-Level Security (RLS).
                </li>
                <li>
                  <strong>Cloudflare Workers AI:</strong> Processes optional text reflections and
                  Whisper voice transcription server-side in ephemeral containers without persisting
                  raw audio.
                </li>
                <li>
                  <strong>Google AdSense:</strong> Serves display advertisements on{" "}
                  <em>public informational pages only</em> (such as the landing page, guides, and
                  blog). Ad scripts are explicitly disabled on private authenticated journal
                  interfaces.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-2xl text-ink">
              6. Disclaimers of Warranties & Limitation of Liability
            </h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;
                basis without warranties of any kind, either express or implied, including but not
                limited to implied warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </p>
              <p>
                To the fullest extent permitted by law, NeuroMirror and its operators shall not be
                liable for any indirect, incidental, consequential, special, or punitive damages,
                including loss of data, profits, or goodwill, arising out of or in connection with
                your use of the Service.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-2xl text-ink">7. Deletion & Termination</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                You may discontinue use of the Service at any time. You can delete individual
                journals, notes, and records directly from your account interface.
              </p>
              <p>
                To request permanent, complete deletion of your user account and all associated
                historical data from our databases, please submit a request to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-display text-2xl text-ink">8. Governing Law & Contact</h2>
            <div className="mt-4 space-y-3 leading-relaxed text-ink-2 font-serif">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India,
                without regard to its conflict of law principles.
              </p>
              <p>
                If you have any questions or concerns regarding these Terms, please contact us at:
              </p>
              <p className="mt-2 text-ink font-sans">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline">
                  {CONTACT_EMAIL}
                </a>
                <br />
                <strong>Website:</strong>{" "}
                <a href={SITE.url} className="text-accent underline">
                  {SITE.url}
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-line mt-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-10 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed">
            NeuroMirror provides informational writing observations only. Not a medical device. ©{" "}
            {new Date().getFullYear()} NeuroMirror.
          </p>
          <div className="flex gap-4">
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
