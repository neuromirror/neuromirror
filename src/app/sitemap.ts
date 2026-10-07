import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    { url: SITE.url + "/cognitive-health-journal", changeFrequency: "monthly", priority: 0.9 },
    { url: SITE.url + "/how-cognitive-analysis-works", changeFrequency: "monthly", priority: 0.8 },
    { url: SITE.url + "/memory-vault-guide", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/privacy`, changeFrequency: "yearly", priority: 0.5 },
  ];
}

