import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// robots.txt is a hint, not security — private routes are also noindexed and
// (from milestone 2) protected by authentication.
export default function robots(): MetadataRoute.Robots {
  const privateRoutes = [
    "/home",
    "/writing",
    "/calendar",
    "/memory-vault",
    "/insights",
    "/games",
    "/reports",
    "/settings",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privateRoutes },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: privateRoutes },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

