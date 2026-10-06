"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import { addDays, formatLong, fromISODate, toISODate } from "@/lib/dates";
import { useStore } from "@/lib/store";
import type { Journal } from "@/lib/types";
import { Empty, EntryRow, ListSkeleton, Skeleton, btnPrimary } from "@/components/ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthGrid(year: number, month: number): string[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const start = toISODate(new Date(year, month, 1 - offset));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export default function CalendarPage() {
  const { ready, today, journals } = useStore();
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<string>("");
  const gridRef = useRef<HTMLDivElement>(null);
  const focusAfterMove = useRef(false);

  useEffect(() => {
    if (ready && !cursor) {
      const d = fromISODate(today);
      setCursor({ y: d.getFullYear(), m: d.getMonth() });
      setSelected(today);
    }
  }, [ready, today, cursor]);

  // The calendar is driven ONLY by journal dates. Notes never appear here.
  const byDate = useMemo(() => {
    const m = new Map<string, Journal[]>();
    journals.filter((j) => !j.archived).forEach((j) => m.set(j.journalDate, [...(m.get(j.journalDate) ?? []), j]));
    m.forEach((list) => list.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
    return m;
  }, [journals]);

  const days = cursor ? monthGrid(cursor.y, cursor.m) : [];

  useEffect(() => {
    if (focusAfterMove.current) {
      focusAfterMove.current = false;
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${selected}"]`)?.focus();
    }
  }, [selected, cursor]);

  function select(d: string, focus = false) {
    const dt = fromISODate(d);
    if (cursor && (dt.getMonth() !== cursor.m || dt.getFullYear() !== cursor.y)) setCursor({ y: dt.getFullYear(), m: dt.getMonth() });
    focusAfterMove.current = focus;
    setSelected(d);
  }

  function shiftMonth(n: number) {
    if (!cursor) return;
    const d = new Date(cursor.y, cursor.m + n, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
    setSelected(toISODate(d)); // keep a focusable day inside the visible month
  }

  function onKey(e: React.KeyboardEvent) {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, PageUp: -30, PageDown: 30 };
    if (e.key in map) {
      e.preventDefault();
      select(addDays(selected, map[e.key]), true);
    }
  }

  const monthLabel = cursor ? new Date(cursor.y, cursor.m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
  const dayJournals = byDate.get(selected) ?? [];
  const monthCount = cursor ? journals.filter((j) => !j.archived && j.journalDate.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`)).length : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-3">Calendar</p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl" aria-live="polite">{monthLabel || " "}</h1>
          {cursor && <p className="mt-1 text-sm text-ink-3">{monthCount} journal{monthCount === 1 ? "" : "s"} this month</p>}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-2 hover:bg-paper-2"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => select(today, true)} className="h-10 rounded-full border border-line px-4 text-sm text-ink-2 hover:bg-paper-2">Today</button>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-2 hover:bg-paper-2"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section aria-label={`Journal calendar, ${monthLabel}`} className="rounded-lg border border-line bg-card p-2 sm:p-4">
          <div className="grid grid-cols-7 text-center text-[0.7rem] uppercase tracking-wider text-ink-3" aria-hidden>
            {WEEKDAYS.map((w) => <div key={w} className="py-2">{w}</div>)}
          </div>
          {!cursor ? <Skeleton className="h-80" /> : (
            <div ref={gridRef} className="grid grid-cols-7 gap-px" onKeyDown={onKey}>
              {days.map((d) => {
                const dt = fromISODate(d);
                const inMonth = dt.getMonth() === cursor.m;
                const n = byDate.get(d)?.length ?? 0;
                const isSel = d === selected;
                const isToday = d === today;
                return (
                  <button
                    key={d}
                    type="button"
                    data-date={d}
                    tabIndex={isSel ? 0 : -1}
                    aria-pressed={isSel}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${formatLong(d)}${n ? `, ${n} journal${n > 1 ? "s" : ""}` : ", no journals"}`}
                    onClick={() => select(d)}
                    className={`relative flex aspect-square flex-col items-center justify-start rounded-md pt-2 text-sm transition-colors sm:aspect-[1.15] sm:pt-2.5 ${
                      isSel ? "bg-ink text-paper" : inMonth ? "text-ink hover:bg-paper-2" : "text-ink-3/60 hover:bg-paper-2"
                    }`}
                  >
                    <span className={isToday && !isSel ? "font-semibold text-accent" : ""}>{dt.getDate()}</span>
                    {n > 0 && (
                      <span className="mt-1.5 flex gap-0.5" aria-hidden>
                        {Array.from({ length: Math.min(n, 3) }).map((_, i) => (
                          <span key={i} className={`h-1.5 w-1.5 rounded-full ${isSel ? "bg-paper" : "bg-accent"}`} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          <p className="px-2 pt-3 text-xs text-ink-3">Use arrow keys to move between days. Dots show journals written for that date.</p>
        </section>

        <section aria-labelledby="day-h" aria-live="polite" className="rounded-lg border border-line">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 id="day-h" className="font-display text-lg text-ink">{selected ? formatLong(selected) : " "}</h2>
            {selected && dayJournals.length > 0 && (
              <Link href={`/writing/journal/new?date=${selected}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3 py-1.5 text-xs text-ink hover:bg-paper-2">
                <NotebookPen className="h-3.5 w-3.5" /> Write Journal
              </Link>
            )}
          </div>
          {!ready ? <ListSkeleton rows={2} /> : dayJournals.length === 0 ? (
            <Empty title="Nothing written for this day."
              action={<Link href={`/writing/journal/new?date=${selected}`} className={btnPrimary}><NotebookPen className="h-4 w-4" /> Write a Journal</Link>} />
          ) : (
            <div className="divide-y divide-line">{dayJournals.map((j) => <EntryRow key={j.id} entry={j} today={today} />)}</div>
          )}
        </section>
      </div>
    </div>
  );
}
