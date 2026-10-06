import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, Newsreader } from "next/font/google";
import { ThemeProvider, themeScript } from "@/components/theme";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s · NeuroMirror",
  },
  description: SITE.description,
  applicationName: SITE.name,
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#f6f1e7",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#1c1b19",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${newsreader.variable} ${instrument.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

        {/* Google AdSense account verification */}
        <meta
          name="google-adsense-account"
          content="ca-pub-7819819942302442"
        />
      </head>

      <body className="grain min-h-dvh">
        <ThemeProvider>
          <div className="relative z-[1]">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
