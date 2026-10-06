"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Folder, NotebookPen, Search, StickyNote } from "lucide-react";
import { useStore } from "@/lib/store";
import { htmlToText } from "@/lib/text";
import type { Entry } from "@/lib/types";
import { Empty, EntryRow, ListSkeleton, Tag, btnGhost, btnPrimary } from "./ui";

export type WritingView = "journals" | "notes" | "favorites" | "archive" | "tags" | "notebooks";

const TABS: { view: WritingView; label: string }[] = [
  { view: "journals", label: "Journals" },
  { view: "notes", label: "Notes" },
  { view: "favorites", label: "Favorites" },
  { view: "archive", label: "Archive" },
  { view: "tags", label: "Tags" },
  { view: "notebooks", label: "Notebooks" },
];

const PAGE = 20;

export function WritingLibrary({ view, tag, notebook }: { view: WritingView; tag: string | null; notebook: string | null }) {
  const { ready, today, journals, notes, notebooks } = useStore();
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const all: Entry[] = useMemo(() => [...journals, ...notes], [journals, notes]);

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    all.filter((e) => !e.archived).forEach((e) => e.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [all]);

  const list = useMemo(() => {
    let items: Entry[] =
      view === "journals" ? journals.filter((j) => !j.archived)
      : view === "notes" ? notes.filter((n) => !n.archived)
      : view === "favorites" ? all.filter((e) => e.favorite && !e.archived)
      : view === "archive" ? all.filter((e) => e.archived)
      : all.filter((e) => !e.archived);
    if (tag) items = items.filter((e) => e.tags.includes(tag));
    if (notebook) items = items.filter((e) => e.notebookId === notebook);
    const s = q.trim().toLowerCase();
    if (s) items = items.filter((e) => (e.title + " " + htmlToText(e.content) + " " + e.tags.join(" ")).toLowerCase().includes(s));
    return items.sort((a, b) => {
      const ka = a.kind === "journal" ? a.journalDate + a.createdAt : a.updatedAt;
      const kb = b.kind === "journal" ? b.journalDate + b.createdAt : b.updatedAt;
      return kb.localeCompare(ka);
    });
  }, [view, journals, notes, all, tag, notebook, q]);

  const showList = view !== "tags" && view !== "notebooks" || tag || notebook;
  const nbName = notebooks.find((n) => n.id === notebook)?.name;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-3">Writing</p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            {tag ? `#${tag}` : nbName ?? TABS.find((t) => t.view === view)!.label}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/writing/journal/new" className={btnPrimary}><NotebookPen className="h-4 w-4" /> New Journal</Link>
          <Link href="/writing/note/new" className={btnGhost}><StickyNote className="h-4 w-4" /> New Note</Link>
        </div>
      </div>

      <nav aria-label="Writing sections" className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-1 border-b border-line">
          {TABS.map((t) => {
            const on = t.view === view && !tag && !notebook;
            return (
              <li key={t.view}>
                <Link href={`/writing?view=${t.view}`} aria-current={on ? "page" : undefined}
                  className={`-mb-px block border-b-2 px-3 py-2.5 text-sm ${on ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {view === "tags" && !tag && (
        <section className="mt-8">
          {!ready ? <ListSkeleton rows={2} /> : tagCounts.length === 0 ? (
            <Empty title="No tags yet" body="Add tags to journals and notes to group them here." />
          ) : (
            <ul className="flex flex-wrap gap-2">
              {tagCounts.map(([t, n]) => (
                <li key={t}>
                  <Link href={`/writing?view=tags&tag=${encodeURIComponent(t)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm text-ink hover:border-line-2">
                    #{t} <span className="text-xs text-ink-3">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {view === "notebooks" && !notebook && (
        <section className="mt-8">
          {!ready ? <ListSkeleton rows={2} /> : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {notebooks.map((nb) => {
                const n = all.filter((e) => e.notebookId === nb.id && !e.archived).length;
                return (
                  <li key={nb.id}>
                    <Link href={`/writing?view=notebooks&notebook=${nb.id}`}
                      className="flex items-center gap-4 rounded-lg border border-line bg-card px-5 py-5 transition hover:border-line-2">
                      <Folder className="h-5 w-5 text-accent" aria-hidden />
                      <span className="flex-1">
                        <span className="block font-display text-lg text-ink">{nb.name}</span>
                        <span className="text-xs text-ink-3">{n} entr{n === 1 ? "y" : "ies"}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {showList && (
        <section className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-card px-4 focus-within:border-accent">
              <Search className="h-4 w-4 text-ink-3" aria-hidden />
              <label htmlFor="lib-q" className="sr-only">Filter by title, text, or tag</label>
              <input id="lib-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by title, text, or tag"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-ink-3" />
            </div>
            {(tag || notebook) && (
              <Link href={`/writing?view=${view}`} className="text-sm text-ink-3 hover:text-ink">Clear filter</Link>
            )}
          </div>
          {view !== "tags" && !tag && tagCounts.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tagCounts.slice(0, 10).map(([t]) => (
                <Link key={t} href={`/writing?view=${view}&tag=${encodeURIComponent(t)}`}><Tag name={t} /></Link>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-lg border border-line">
            {!ready ? <ListSkeleton /> : list.length === 0 ? (
              q ? <Empty title="Nothing matches that filter" body="Try fewer words, or open Memory Vault to search by meaning." />
              : view === "journals" ? <Empty title="Your story starts here." body="Write your first journal. Every journal has a date and appears on your calendar."
                  action={<Link href="/writing/journal/new" className={btnPrimary}>Write a Journal</Link>} />
              : view === "notes" ? <Empty title="Capture an idea, task, reminder, or thought."
                  action={<Link href="/writing/note/new" className={btnPrimary}>New Note</Link>} />
              : view === "favorites" ? <Empty title="No favorites yet" body="Star a journal or note to keep it close." />
              : view === "archive" ? <Empty title="Archive is empty" body="Archived entries leave your main lists but stay recoverable here." />
              : <Empty title="Nothing here yet" />
            ) : (
              <>
                <div className="divide-y divide-line">{list.slice(0, limit).map((e) => <EntryRow key={e.id} entry={e} today={today} />)}</div>
                {list.length > limit && (
                  <div className="border-t border-line p-4 text-center">
                    <button type="button" onClick={() => setLimit((l) => l + PAGE)} className={btnGhost}>Show more</button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
