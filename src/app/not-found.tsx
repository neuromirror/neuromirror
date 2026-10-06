import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-3">404</p>
        <h1 className="mt-3 font-display text-4xl text-ink">This page isn’t here.</h1>
        <p className="mt-3 text-ink-2">It may have moved, or it never existed.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-5 py-2.5 text-sm text-paper">Back to NeuroMirror</Link>
      </div>
    </main>
  );
}
