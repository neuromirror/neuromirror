"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-[60dvh] place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl text-ink">Something went wrong.</h1>
        <p className="mt-3 text-ink-2">An unexpected error occurred. Please try again.</p>
        <button type="button" onClick={reset} className="mt-8 rounded-full bg-ink px-5 py-2.5 text-sm text-paper">Try again</button>
      </div>
    </main>
  );
}
