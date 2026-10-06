import Script from "next/script";

/** Load AdSense Auto ads on public informational pages only. */
export function AdSenseLoader() {
  return <Script async strategy="afterInteractive" crossOrigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7819819942302442" />;
}
