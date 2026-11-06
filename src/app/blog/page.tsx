import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { AdSenseLoader } from "@/components/adsense-loader";
import { AdSenseUnit } from "@/components/adsense-unit";
import { getAllPosts, getCategories } from "@/lib/content/blog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "NeuroMirror Blog – Insights on Cognitive Health, Journaling & Memory",
  description:
    "Educational articles and guides on cognitive-linguistic awareness, private journaling, family memory preservation, and mindful reflection.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE.url}/blog`,
    siteName: SITE.name,
    title: "NeuroMirror Blog – Cognitive Health & Mindful Journaling",
    description:
      "Explore expert insights on linguistic patterns, memory preservation, digital privacy, and the science of reflective journaling.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NeuroMirror Blog" }],
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const categories = getCategories();
  const [featured, ...remaining] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE.url}/blog/#blog`,
    name: "NeuroMirror Blog",
    description: "Insights on cognitive health, linguistic patterns, and personal journaling.",
    url: `${SITE.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/favicon.svg`,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      url: `${SITE.url}/blog/${post.slug}`,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  };

  return (
    <>
      <AdSenseLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
            Home
          </Link>
          <Link href="/about" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
            About
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
            Start Journaling Free
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        {/* Header Section */}
        <section className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-3">NeuroMirror Publication</p>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl lg:text-6xl">
            Reflections on mind, memory, and language.
          </h1>
          <p className="mt-5 font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
            Explore scientifically grounded research, practical writing guides, and thoughtful
            explorations of cognitive health, memory preservation, and digital privacy.
          </p>

          {/* Categories Pill Navigation */}
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-paper">
              All Articles
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-line bg-card px-4 py-1.5 text-xs text-ink-2"
              >
                {cat}
              </span>
            ))}
          </div>
        </section>

        {/* Featured Article Card */}
        {featured && (
          <section className="mt-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block overflow-hidden rounded-xl border border-line bg-card p-6 transition-all hover:border-line-2 hover:shadow-soft sm:p-10"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-3">
                <span className="rounded-md bg-paper-2 px-2.5 py-1 font-medium text-accent">
                  {featured.category}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {featured.readingTime}
                </span>
                <span>·</span>
                <span>{featured.publishedAt}</span>
              </div>

              <h2 className="mt-4 font-display text-2xl text-ink transition-colors group-hover:text-accent sm:text-3xl lg:text-4xl">
                {featured.title}
              </h2>

              <p className="mt-4 font-serif text-base leading-relaxed text-ink-2 sm:text-lg">
                {featured.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <div className="text-xs text-ink-3">
                  By <strong className="text-ink">{featured.author.name}</strong> ·{" "}
                  {featured.author.role}
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:underline">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </section>
        )}

        {/* Ad Placement */}
        <AdSenseUnit slot="blog-index-mid" className="my-10" />

        {/* Remaining Articles Grid */}
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">More Articles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remaining.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-xl border border-line bg-card p-6 transition-all hover:border-line-2 hover:shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-ink-3">
                    <span className="rounded bg-paper-2 px-2 py-0.5 font-medium text-ink-2">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readingTime}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl text-ink transition-colors group-hover:text-accent">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 font-serif text-sm leading-relaxed text-ink-2">
                    {post.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-line pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-3">{post.publishedAt}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-medium text-accent group-hover:underline"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Journaling Call To Action Banner */}
        <section className="mt-20 rounded-xl bg-paper-2/80 border border-line p-8 sm:p-12 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-accent" />
          <h2 className="mt-4 font-display text-3xl text-ink">
            Put these insights into practice today
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-serif text-base text-ink-2">
            NeuroMirror gives you a calm, private space for daily writing, voice journaling, and
            thoughtful non-diagnostic cognitive reflections.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:opacity-90"
            >
              Start Your Private Journal Free
            </Link>
            <Link
              href="/how-cognitive-analysis-works"
              className="rounded-full border border-line-2 px-6 py-3 text-sm text-ink hover:bg-paper"
            >
              Learn How Analysis Works
            </Link>
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
          </div>
        </div>
      </footer>
    </>
  );
}
