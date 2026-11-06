import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Share2, Tag, Calendar, UserCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeSwitch } from "@/components/theme-switch";
import { AdSenseLoader } from "@/components/adsense-loader";
import { AdSenseUnit } from "@/components/adsense-unit";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { SITE } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found · NeuroMirror",
    };
  }

  const url = `${SITE.url}/blog/${post.slug}`;

  return {
    title: `${post.title} · NeuroMirror`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      siteName: SITE.name,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/favicon.svg`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <AdSenseLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-ink-2 hover:text-ink">
            &larr; All Articles
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

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs" className="mb-6 flex items-center gap-2 text-xs text-ink-3">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-ink">
            Blog
          </Link>
          <span>/</span>
          <span className="truncate text-ink-2">{post.category}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
            <span className="rounded-full bg-paper-2 px-3 py-1 font-medium text-accent">
              {post.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Published {post.publishedAt}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.readingTime}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
            {post.description}
          </p>

          <div className="mt-8 flex items-center justify-between border-y border-line py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent font-semibold text-sm">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{post.author.name}</p>
                <p className="text-xs text-ink-3">{post.author.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Top Ad Banner for AdSense */}
        <AdSenseUnit slot="blog-article-top" className="mb-8" />

        {/* Article Body */}
        <article
          className="prose prose-neutral max-w-none text-ink font-serif text-lg leading-relaxed [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:text-ink [&>p]:mb-6 [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:mb-2 [&>code]:rounded [&>code]:bg-paper-2 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:font-mono [&>code]:text-sm [&>pre]:my-6 [&>pre]:rounded-lg [&>pre]:bg-ink [&>pre]:p-4 [&>pre]:text-paper [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-paper"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-6">
          <Tag className="h-4 w-4 text-ink-3" />
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-line bg-card px-2.5 py-1 text-xs text-ink-2"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Mid/Bottom Ad Banner for AdSense */}
        <AdSenseUnit slot="blog-article-bottom" className="my-10" />

        {/* Author Bio Box */}
        <div className="mt-8 rounded-xl border border-line bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Written by {post.author.name}</p>
              <p className="text-xs text-ink-3">{post.author.role}</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-2">
                NeuroMirror research contributors write in accordance with strict ethical standards:
                prioritizing mindful self-reflection, non-diagnostic transparency, and strict data
                privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-display text-2xl text-ink">Related Reading</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-lg border border-line bg-card p-5 transition hover:border-line-2"
                >
                  <span className="text-xs text-accent font-medium">{r.category}</span>
                  <h3 className="mt-2 font-display text-lg text-ink group-hover:text-accent">
                    {r.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-ink-2">{r.description}</p>
                  <span className="mt-4 block text-xs font-medium text-accent">
                    Read article &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 rounded-xl bg-ink p-8 text-center text-paper">
          <h2 className="font-display text-2xl sm:text-3xl">
            Experience writing-led cognitive awareness
          </h2>
          <p className="mx-auto mt-2 max-w-md font-serif text-sm opacity-80">
            Keep your thoughts in a private journal where your words remain strictly yours.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink hover:opacity-90"
          >
            Create Your Private Journal
          </Link>
        </div>
      </main>

      <footer className="border-t border-line mt-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-5 py-10 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed">
            NeuroMirror provides informational writing observations only. Not a medical device. ©{" "}
            {new Date().getFullYear()} NeuroMirror.
          </p>
          <div className="flex gap-4">
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
