import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="NeuroMirror home">
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
        <rect width="64" height="64" rx="14" className="fill-ink" />
        <path d="M20 44V20l12 14 12-14v24" fill="none" className="stroke-paper" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="50" r="2.5" fill="#c9a26a" />
      </svg>
      <span className="font-display text-[1.15rem] tracking-tight text-ink">NeuroMirror</span>
    </Link>
  );
}
