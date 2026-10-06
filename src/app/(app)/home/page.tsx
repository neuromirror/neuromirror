"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Archive, ArrowRight, NotebookPen, PenLine, Search, StickyNote } from "lucide-react";
import { addDays, deadlineInfo, formatShort, greeting } from "@/lib/dates";
import { useStore } from "@/lib/store";
import { htmlToText, wordCount } from "@/lib/text";
import { DeadlineBadge, EntryRow, ListSkeleton, Skeleton, entryHref } from "@/components/ui";

function streak(dates: Set<string>, today: string) {
  let d = dates.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (dates.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export default function HomePage() {
  const { ready, now, today, journals, notes } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");

  const active = useMemo(() => ({
    journals: journals.filter((j) => !j.archived),
    notes: notes.filter((n) => !n.archived),
  }), [journals, notes]);

  const stats = useMemo(() => {
    const all = [...active.journals, ...active.notes];
    return {
      journals: active.journals.length,
      notes: active.notes.length,
      streak: ready ? streak(new Set(active.journals.map((j) => j.journalDate)), today) : 0,
      words: all.reduce((s, e) => s + wordCount(htmlToText(e.content)), 0),
      favorites: all.filter((e) => e.favorite).length,
    };
  }, [active, ready, today]);

  // Deadlines are derived only from (active, incomplete) notes — never journal dates.
  const deadlines = useMemo(() => {
    if (!ready) return [];
    return active.notes
      .filter((n) => n.deadline && !n.completed)
      .map((n) => ({ note: n, info: deadlineInfo(n.deadline!, today) }))
      .sort((a, b) => a.info.days - b.info.days);
  }, [active.notes, ready, today]);

  const counts = {
    overdue: deadlines.filter((d) => d.info.urgency === "overdue").length,
    today: deadlines.filter((d) => d.info.urgency === "today").length,
    week: deadlines.filter((d) => d.info.days > 0 && d.info.days <= 7).length,
    upcoming: deadlines.filter((d) => d.info.days >= 0).length,
  };

  const recent = useMemo(
    () => [...active.journals, ...active.notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [active],
  );
  const lastEdited = recent[0];

  function search(e: React.FormEvent) {
    e.preventDefault();
    const s = q.trim();
    router.push(s ? `/memory-vault?q=${encodeURIComponent(s)}` : "/memory-vault");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      {/* Welcome */}
      <section className="rise">
        {ready ? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-3">
              {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {greeting(now)}. <span className="italic text-ink-2">What is on your mind?</span>
            </h1>
          </>
        ) : (
          <div className="space-y-3"><Skeleton className="h-3 w-40" /><Skeleton className="h-12 w-3/4" /></div>
        )}
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions" className="rise rise-1 mt-8 flex flex-wrap gap-2.5">
        <Link href="/writing/journal/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm text-paper hover:opacity-90">
          <NotebookPen className="h-4 w-4" aria-hidden /> New Journal
        </Link>
        <Link href="/writing/note/new" className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2.5 text-sm text-ink hover:bg-paper-2">
          <StickyNote className="h-4 w-4" aria-hidden /> New Note
        </Link>
        <Link href="/memory-vault" className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2.5 text-sm text-ink hover:bg-paper-2">
          <Archive className="h-4 w-4" aria-hidden /> Open Memory Vault
        </Link>
        {lastEdited && (
          <Link href={entryHref(lastEdited)} className="inline-flex items-center gap-2 rounded-full border border-line-2 px-4 py-2.5 text-sm text-ink hover:bg-paper-2">
            <PenLine className="h-4 w-4" aria-hidden /> Continue Writing
          </Link>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          {/* Memory Vault card */}
          <section aria-labelledby="mv-h" className="rise rise-2 rounded-lg border border-line bg-card p-6 shadow-soft sm:p-8">
            <h2 id="mv-h" className="font-display text-2xl text-ink">Memory Vault</h2>
            <p className="mt-1 text-ink-2">Find something you wrote before.</p>
            <form onSubmit={search} className="mt-5" role="search">
              <label htmlFor="home-mv" className="sr-only">Describe a memory</label>
              <div className="flex items-center gap-2 rounded-full border border-line-2 bg-paper px-4 focus-within:border-accent">
                <Search className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                <input id="home-mv" value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="When did I write about being nervous before exams?"
                  className="min-w-0 flex-1 bg-transparent py-3 font-serif text-[1.02rem] text-ink outline-none placeholder:text-ink-3" />
                <button type="submit" aria-label="Search memories" className="rounded-full p-1.5 text-ink-2 hover:bg-paper-2 hover:text-ink">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>

          {/* Recent writing */}
          <section aria-labelledby="recent-h" className="rise rise-3 rounded-lg border border-line">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="recent-h" className="font-display text-xl text-ink">Recent writing</h2>
              <Link href="/writing" className="text-sm text-ink-3 hover:text-ink">View all</Link>
            </div>
            {!ready ? <ListSkeleton rows={3} /> : (
              <div className="divide-y divide-line">{recent.map((e) => <EntryRow key={e.id} entry={e} today={today} />)}</div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Deadlines */}
          <section aria-labelledby="dl-h" className="rise rise-2 rounded-lg border border-line bg-card p-6">
            <div className="flex items-baseline justify-between">
              <h2 id="dl-h" className="font-display text-xl text-ink">Upcoming deadlines</h2>
              <Link href="/writing?view=notes" className="text-sm text-ink-3 hover:text-ink">Notes</Link>
            </div>
            {!ready ? <div className="mt-5 space-y-3"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div> : (
              <>
                <p className="mt-4 font-display text-4xl text-ink" aria-live="polite">
                  {counts.upcoming}
                  <span className="ml-2 font-sans text-sm text-ink-2">upcoming deadline{counts.upcoming === 1 ? "" : "s"}</span>
                </p>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["Overdue", counts.overdue, "text-clay"],
                    ["Due today", counts.today, "text-amber"],
                    ["This week", counts.week, "text-accent"],
                  ].map(([l, n, c]) => (
                    <div key={l as string} className="rounded-md bg-paper px-2 py-2.5">
                      <dt className="text-[0.7rem] uppercase tracking-wider text-ink-3">{l}</dt>
                      <dd className={`mt-0.5 font-display text-xl ${c}`}>{n}</dd>
                    </div>
                  ))}
                </dl>
                {deadlines.length === 0 ? (
                  <p className="mt-5 text-sm text-ink-3">No deadlines. Add one to any note when you need it.</p>
                ) : (
                  <ul className="mt-5 divide-y divide-line">
                    {deadlines.slice(0, 5).map(({ note }) => (
                      <li key={note.id}>
                        <Link href={entryHref(note)} className="flex items-center justify-between gap-3 py-3 hover:text-accent">
                          <span className="min-w-0">
                            <span className="block truncate text-[0.95rem] text-ink">{note.title || "Untitled note"}</span>
                            <span className="text-xs text-ink-3">{formatShort(note.deadline!)}</span>
                          </span>
                          <DeadlineBadge deadline={note.deadline!} today={today} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {/* Activity */}
          <section aria-labelledby="act-h" className="rise rise-3 rounded-lg border border-line p-6">
            <h2 id="act-h" className="font-display text-xl text-ink">Writing activity</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
              {[
                ["Journals written", stats.journals],
                ["Notes created", stats.notes],
                ["Writing streak", `${stats.streak} day${stats.streak === 1 ? "" : "s"}`],
                ["Words written", stats.words.toLocaleString()],
                ["Favorite entries", stats.favorites],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <dt className="text-xs text-ink-3">{l}</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">{ready ? v : <Skeleton className="h-7 w-12" />}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Reflection */}
          <section aria-labelledby="ref-h" className="rise rise-4 rounded-lg border border-dashed border-line-2 p-6">
            <h2 id="ref-h" className="font-display text-xl text-ink">Reflection</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              When AI reflection is connected, a short, optional reflection based only on your recent entries will appear
              here. It will only run when you ask for it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
