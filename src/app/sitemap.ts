import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllPosts } from "@/lib/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/cognitive-health-journal`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/how-cognitive-analysis-works`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/memory-vault-guide`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/partners`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/terms`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/privacy`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [...staticRoutes, ...blogRoutes];
}
