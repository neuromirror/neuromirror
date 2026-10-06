import type { NextConfig } from "next";

// Inline scripts/styles are required by Next.js hydration and the pre-paint
// theme script. connect-src allows https for the auth/database provider.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagservices.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const PRIVATE_ROUTES = [
  "/home", "/writing", "/writing/:path*", "/calendar", "/memory-vault", "/insights",
  "/games", "/reports", "/settings", "/signin", "/signup", "/forgot-password", "/reset-password",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...PRIVATE_ROUTES.map((source) => ({ source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
    ];
  },
};

export default nextConfig;
