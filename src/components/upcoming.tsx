import { Info } from "lucide-react";

/** Honest placeholder for sections scheduled in a later milestone (see PLAN.md). */
export function Upcoming({ eyebrow, title, intro, items, note }: {
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; body: string }[];
  note?: string;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-3">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl font-serif text-lg leading-relaxed text-ink-2">{intro}</p>
      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper-2 px-3 py-1.5 text-xs text-ink-2">
        <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden /> Being prepared
      </p>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.title} className="bg-paper p-6">
            <h2 className="font-display text-lg text-ink">{i.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{i.body}</p>
          </li>
        ))}
      </ul>
      {note && (
        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {note}
        </p>
      )}
    </div>
  );
}
