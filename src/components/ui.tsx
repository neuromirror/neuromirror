"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { deadlineInfo, formatMedium, type Urgency } from "@/lib/dates";
import { excerpt } from "@/lib/text";
import { MOODS, type Entry } from "@/lib/types";

export function Tag({ name, onClick, active }: { name: string; onClick?: () => void; active?: boolean }) {
  const cls = `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
    active ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-3"
  } ${onClick ? "hover:border-line-2 hover:text-ink" : ""}`;
  return onClick ? (
    <button type="button" onClick={onClick} aria-pressed={active} className={cls}>#{name}</button>
  ) : (
    <span className={cls}>#{name}</span>
  );
}

const URGENCY_STYLE: Record<Urgency, string> = {
  overdue: "bg-clay-soft text-clay",
  today: "bg-amber-soft text-amber",
  soon: "bg-amber-soft text-amber",
  upcoming: "bg-accent-soft text-accent",
  later: "bg-paper-2 text-ink-3",
};

export function DeadlineBadge({ deadline, today, completed }: { deadline: string; today: string; completed?: boolean }) {
  if (completed) return <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs text-ink-3">Done</span>;
  const info = deadlineInfo(deadline, today);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${URGENCY_STYLE[info.urgency]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {info.label}
    </span>
  );
}

export function MoodLabel({ mood }: { mood: string | null }) {
  const m = MOODS.find((x) => x.value === mood);
  if (!m) return null;
  return <span className="text-xs text-ink-3"><span aria-hidden>{m.glyph}</span> {m.label}</span>;
}

export function entryHref(e: Entry) {
  return `/writing/${e.kind}/${e.id}`;
}

export function EntryRow({ entry, today }: { entry: Entry; today: string }) {
  return (
    <Link href={entryHref(entry)} className="group block rounded-lg px-4 py-4 transition-colors hover:bg-card sm:px-5">
      <div className="flex items-center gap-3 text-xs text-ink-3">
        <span className="uppercase tracking-[0.14em]">{entry.kind === "journal" ? formatMedium(entry.journalDate) : "Note"}</span>
        {entry.kind === "journal" && <MoodLabel mood={entry.mood} />}
        {entry.kind === "note" && entry.deadline && <DeadlineBadge deadline={entry.deadline} today={today} completed={entry.completed} />}
        {entry.favorite && <Star className="ml-auto h-3.5 w-3.5 fill-amber text-amber" aria-label="Favorite" />}
      </div>
      <h3 className="mt-1.5 font-display text-lg text-ink group-hover:text-accent">{entry.title || "Untitled"}</h3>
      <p className="mt-1 line-clamp-2 font-serif text-[0.98rem] leading-relaxed text-ink-2">{excerpt(entry.content)}</p>
      {entry.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">{entry.tags.map((t) => <Tag key={t} name={t} />)}</div>
      )}
    </Link>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden />;
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6 px-5 py-4" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="h-10 w-8 rounded-sm border border-line-2 bg-card shadow-soft" aria-hidden />
      <p className="mt-5 font-display text-xl text-ink">{title}</p>
      {body && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:opacity-90";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-2 px-4 py-2.5 text-sm text-ink transition hover:bg-paper-2";
