import Link from "next/link";
import { Logo } from "@/components/logo";
import { SITE } from "@/lib/site";

type PublicArticleProps = {
  title: string;
  eyebrow: string;
  summary: string;
  children: React.ReactNode;
};

export function PublicArticle({ title, eyebrow, summary, children }: PublicArticleProps) {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <Logo />
        <nav aria-label="Public pages" className="flex items-center gap-4 text-sm text-ink-2">
          <Link href="/cognitive-health-journal" className="hover:text-ink">Cognitive health journal</Link>
          <Link href="/memory-vault-guide" className="hidden hover:text-ink sm:inline">Memory Vault</Link>
          <Link href="/privacy" className="hidden hover:text-ink sm:inline">Privacy</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-3">
          <Link href="/" className="underline-offset-4 hover:text-ink hover:underline">NeuroMirror</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page" className="text-ink-2">{title}</span>
        </nav>
        <article>
          <header className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-3">{eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-ink sm:text-6xl">{title}</h1>
            <p className="mt-6 font-serif text-xl leading-relaxed text-ink-2">{summary}</p>
          </header>
          <div className="prose-neuromirror mt-12 max-w-3xl space-y-10 text-[1.02rem] leading-8 text-ink-2">
            {children}
          </div>
        </article>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-9 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed text-ink-3">
            NeuroMirror offers optional, informational observations about writing. It is not a medical device and does not
            diagnose or treat any condition.
          </p>
          <Link href="/" className="text-ink-2 underline underline-offset-4">About NeuroMirror</Link>
        </div>
      </footer>
    </>
  );
}

export function PublicPageJsonLd({
  title,
  path,
  description,
}: {
  title: string;
  path: string;
  description: string;
}) {
  const url = new URL(path, SITE.url).toString();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: title,
        description,
        isPartOf: { "@id": SITE.url + "/#website" },
        publisher: { "@id": SITE.url + "/#organization" },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.url },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}


