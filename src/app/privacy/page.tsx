import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy – NeuroMirror",
  description:
    "Full Privacy Policy for NeuroMirror. Covers data collection, cookies, Google AdSense advertising, third-party services, GDPR and CCPA rights, and how to contact us.",
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE_DATE = "22 October 2024";
const CONTACT_EMAIL = "contact@neuromirror.in";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Logo />
      <main className="mt-16">
        <h1 className="font-display text-5xl text-ink">Privacy Policy</h1>
        <p className="mt-3 text-sm text-ink-3">
          Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Last updated: {EFFECTIVE_DATE}
        </p>
        <p className="mt-6 font-serif text-xl leading-relaxed text-ink-2">
          NeuroMirror (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy. This Privacy
          Policy explains how we collect, use, and protect information when you use{" "}
          <strong className="font-medium text-ink">neuromirror.in</strong> (the &ldquo;Service&rdquo;).
        </p>

        <div className="mt-12 space-y-12">

          {/* 1 */}
          <section>
            <h2 className="font-display text-2xl text-ink">1. Who We Are</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              NeuroMirror is an independent digital journal and personal memory-archive application operated from India.
              For privacy enquiries, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-2xl text-ink">2. Information We Collect</h2>
            <div className="mt-4 space-y-5 leading-relaxed text-ink-2">
              <div>
                <h3 className="font-semibold text-ink">2a. Account information</h3>
                <p className="mt-2">
                  When you create an account, we collect your email address and a hashed password. We do not collect
                  your name, phone number, or government identifier unless you voluntarily add them to a journal entry.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">2b. Journal and note content</h3>
                <p className="mt-2">
                  Your journal entries, notes, notebook titles, saved memories, freeform canvas data, voice transcripts,
                  and cognitive-analysis results are stored in your account. This content is private to you and protected
                  by row-level database security. We do not read or sell your writing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">2c. Usage and device data</h3>
                <p className="mt-2">
                  We may collect technical information automatically, including your IP address, browser type, device
                  type, pages visited, and timestamps. This information helps us maintain performance and security.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">2d. Cookies and similar technologies</h3>
                <p className="mt-2">
                  We use cookies and similar tracking technologies for the following purposes:
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>
                    <strong>Authentication cookies</strong>: Set by Supabase to keep you signed in between sessions.
                  </li>
                  <li>
                    <strong>Preference cookies</strong>: Store your theme (light/dark) and display preferences.
                  </li>
                  <li>
                    <strong>Analytics cookies</strong>: Aggregated, anonymous statistics about how our pages are used.
                    No journal text is ever included.
                  </li>
                  <li>
                    <strong>Advertising cookies</strong>: Google AdSense may set cookies on your browser to serve
                    personalised advertisements based on your visits to this and other websites. See Section 6 for full
                    details.
                  </li>
                </ul>
                <p className="mt-2">
                  You can control cookies through your browser settings. Disabling cookies may affect certain features of
                  the Service (for example, staying signed in).
                </p>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-2xl text-ink">3. How We Use Your Information</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 leading-relaxed text-ink-2">
              <li>To provide, maintain, and improve the Service.</li>
              <li>To authenticate you and protect your account.</li>
              <li>To send essential account emails (password reset, security notices).</li>
              <li>To generate optional AI writing-analysis results when you explicitly request them.</li>
              <li>To display aggregate, anonymised usage statistics.</li>
              <li>To serve contextual advertising through Google AdSense (public pages only).</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-2xl text-ink">4. AI and Third-Party Processing</h2>
            <div className="mt-4 space-y-5 leading-relaxed text-ink-2">
              <div>
                <h3 className="font-semibold text-ink">4a. Cloudflare Workers AI – cognitive analysis</h3>
                <p className="mt-2">
                  When you click the Analyse button on a journal entry, only the text of that selected entry and up to
                  five of your previous analysis summaries are sent to Cloudflare Workers AI for inference. No other
                  journal entries, notes, or personal identifiers are included. Cloudflare processes this data to return
                  a language-pattern observation that is then saved to your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">4b. Cloudflare Whisper – voice transcription</h3>
                <p className="mt-2">
                  If you record a voice journal and request transcription, the audio is sent to Cloudflare&rsquo;s
                  Whisper model. The audio file is not retained by NeuroMirror or Cloudflare after transcription
                  completes. The returned text draft is editable and is added to a journal only after you review and save
                  it. Vocal tone, speaker identity, and health characteristics are not analysed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink">4c. Supabase</h3>
                <p className="mt-2">
                  All account data (journals, notes, notebooks, memories, analyses) is stored in Supabase, a
                  cloud-database provider. Data is encrypted in transit and at rest. Supabase row-level security ensures
                  each account can access only its own records. Supabase&rsquo;s data is hosted in Seoul, South Korea
                  (ap-northeast-2).
                </p>
              </div>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-2xl text-ink">5. Data Sharing</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              We do not sell your personal data. We do not share your journal content, note content, or personal
              identifiers with advertisers. We may share data with:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2 leading-relaxed text-ink-2">
              <li>
                <strong>Infrastructure providers</strong> (Cloudflare, Supabase) to the minimum extent necessary to run
                the Service.
              </li>
              <li>
                <strong>Law enforcement or regulators</strong> if required by applicable law or to protect the rights,
                property, or safety of users or the public.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-2xl text-ink">6. Google AdSense and Advertising</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              NeuroMirror uses <strong>Google AdSense</strong> to display advertisements on public-facing pages (the
              landing page, blog, about page, and informational articles). Advertisements are <em>not</em> shown inside
              the private, password-protected journal application.
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              Google AdSense uses cookies and the DoubleClick cookie to serve ads based on your prior visits to this
              site and other sites on the Internet. Google&rsquo;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visit to our site and/or other sites on the Internet. You may
              opt out of personalised advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                Google Ads Settings
              </a>
              .
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              You can also opt out of third-party vendor use of cookies for personalised advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                www.aboutads.info/choices
              </a>{" "}
              or{" "}
              <a
                href="https://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                www.youronlinechoices.eu
              </a>
              .
            </p>
            <p className="mt-3 leading-relaxed text-ink-2">
              For more information on how Google collects and processes data, please visit{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                How Google uses data when you use our partners&rsquo; sites or apps
              </a>
              .
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-2xl text-ink">7. Your Rights (GDPR &amp; CCPA)</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              Depending on where you live, you may have the following rights regarding your personal data:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2 leading-relaxed text-ink-2">
              <li>
                <strong>Right to access</strong>: Request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong>Right to rectification</strong>: Ask us to correct inaccurate data.
              </li>
              <li>
                <strong>Right to erasure (&ldquo;right to be forgotten&rdquo;)</strong>: Request deletion of your
                account and all associated data. Contact us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>{" "}
                to request account removal.
              </li>
              <li>
                <strong>Right to restrict processing</strong>: Ask us to limit how we use your data.
              </li>
              <li>
                <strong>Right to data portability</strong>: Request a machine-readable export of your data.
              </li>
              <li>
                <strong>Right to object</strong>: Object to processing based on legitimate interests or for direct
                marketing purposes.
              </li>
              <li>
                <strong>California residents (CCPA)</strong>: You have the right to know what personal information we
                collect, the right to delete it, and the right to opt out of the sale of personal information. We do not
                sell personal information.
              </li>
            </ul>
            <p className="mt-3 leading-relaxed text-ink-2">
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display text-2xl text-ink">8. Data Retention</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              We retain your account data for as long as your account is active. You can delete individual journals and
              notes from within the app at any time. To request full account deletion, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              . Backups may persist for up to 30 days after deletion.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-2xl text-ink">9. Children&rsquo;s Privacy</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              NeuroMirror is not directed at children under 13 years of age. We do not knowingly collect personal
              information from children. If you believe a child has provided us personal information, please contact us
              immediately so we can delete it.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-display text-2xl text-ink">10. Security</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              We take reasonable technical and organisational measures to protect your data, including TLS encryption in
              transit, database-level row-level security, and hashed passwords. No system can guarantee absolute
              security. We describe our actual protections rather than making unqualified guarantees.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="font-display text-2xl text-ink">11. Changes to This Policy</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              We may update this Privacy Policy from time to time. When we make material changes, we will update the
              effective date at the top of this page. Continued use of the Service after changes are posted constitutes
              acceptance of the revised policy.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="font-display text-2xl text-ink">12. Contact</h2>
            <p className="mt-3 leading-relaxed text-ink-2">
              For any privacy questions, requests, or complaints, please contact us:
            </p>
            <address className="mt-3 not-italic leading-relaxed text-ink-2">
              <strong className="text-ink">NeuroMirror</strong>
              <br />
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              <br />
              Website:{" "}
              <a href={SITE.url} className="text-accent underline underline-offset-4">
                {SITE.url}
              </a>
            </address>
          </section>
        </div>

        <div className="mt-16 flex flex-wrap gap-6 border-t border-line pt-8">
          <Link href="/" className="text-sm text-accent underline underline-offset-4">
            ← Back to NeuroMirror
          </Link>
          <Link href="/about" className="text-sm text-accent underline underline-offset-4">
            About NeuroMirror
          </Link>
          <Link href="/blog" className="text-sm text-accent underline underline-offset-4">
            Blog
          </Link>
          <Link href="/terms" className="text-sm text-accent underline underline-offset-4">
            Terms & Conditions
          </Link>
          <Link href="/partners" className="text-sm text-accent underline underline-offset-4">
            Investors
          </Link>
        </div>
      </main>
    </div>
  );
}
