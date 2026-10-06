import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// robots.txt is a hint, not security — private routes are also noindexed and
// (from milestone 2) protected by authentication.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy"],
      disallow: ["/home", "/writing", "/calendar", "/memory-vault", "/insights", "/games", "/reports", "/settings", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
