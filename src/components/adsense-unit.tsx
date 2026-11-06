"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
}

/**
 * AdSense responsive ad unit component.
 * Complies with Google AdSense Policies:
 * - Marked with transparent "ADVERTISEMENT" header
 * - Reserved min-height to prevent cumulative layout shift (CLS)
 * - Safe for Next.js SSR / hydration
 */
export function AdSenseUnit({
  slot = "1234567890",
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only attempt to push in browser environment once per mount
    if (typeof window !== "undefined" && !pushedRef.current) {
      try {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      } catch {
        // Ignored if ad blocker is active or script still downloading
      }
    }
  }, []);

  return (
    <div
      className={`my-8 overflow-hidden rounded-lg border border-line bg-paper-2/40 p-3 text-center ${className}`}
      aria-label="Sponsored advertisement"
    >
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-3">
        Advertisement
      </span>
      <div className="min-h-[100px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7819819942302442"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
