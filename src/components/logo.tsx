import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="NeuroMirror home">
      <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
        <rect width="64" height="64" rx="14" className="fill-ink" />
        <path d="M29 17c-7.1-3.5-14 2-14 9.1 0 3.3 1.5 5.5 3.6 7-2.1 1.7-3.6 4-3.6 7.1 0 7.1 6.9 12.6 14 9.1 1.8-.9 3-2.4 3-4.7V21.7c0-2.3-1.2-3.8-3-4.7Z" fill="none" className="stroke-paper" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 17c7.1-3.5 14 2 14 9.1 0 3.3-1.5 5.5-3.6 7 2.1 1.7 3.6 4 3.6 7.1 0 7.1-6.9 12.6-14 9.1-1.8-.9-3-2.4-3-4.7V21.7c0-2.3 1.2-3.8 3-4.7Z" fill="none" className="stroke-paper" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 17v33" stroke="#c9a26a" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="32" r="2.5" fill="#c9a26a" />
      </svg>
      <span className="font-display text-[1.15rem] tracking-tight text-ink">NeuroMirror</span>
    </Link>
  );
}

