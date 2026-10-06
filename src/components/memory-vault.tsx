"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Info, Search, Star } from "lucide-react";
import { daysBetween, formatMedium, fromISODate } from "@/lib/dates";
import { keywordSearch, queryTerms } from "@/lib/keyword-search";
import { useStore } from "@/lib/store";
import { excerpt } from "@/lib/text";
import { MOODS, type Journal, type Mood } from "@/lib/types";
import { Empty, ListSkeleton, MoodLabel, Tag, btnGhost, btnPrimary } from "./ui";

type Tab = "search" | "saved" | "timeline" | "onthisday";
type Sort = "relevance" | "newest" | "oldest";

const TABS: { id: Tab; label: string }[] = [
  { id: "search", label: "Search" },
  { id: "saved", label: "Saved memories" },
  { id: "timeline", label: "Timeline" },
  { id: "onthisday", label: "On This Day" },
];

const FILTER_KEY = "nm-vault-filters";

interface Filters {
  from: string;
  to: string;
  notebook: string;
  tag: string;
  mood: string;
  favorites: boolean;
  sort: Sort;
}
const EMPTY: Filters = { from: "", to: "", notebook: "", tag: "", mood: "", favorites: false, sort: "relevance" };

export function MemoryVault({ initialQuery }: { initialQuery: string }) {
  const { ready, today, journals, notebooks, savedMemoryIds, toggleSavedMemory } = useStore();
  const [tab, setTab] = useState<Tab>("search");
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [f, setF] = useState<Filters>(EMPTY);

  // Remember filter state between visits (filters only — never the query text).
  useEffect(() => {
    try {
      const s = sessionStorage.getItem(FILTER_KEY);
      if (s) setF({ ...EMPTY, ...JSON.parse(s) });
    } catch {}
  }, []);
  useEffect(() => {
    sessionStorage.setItem(FILTER_KEY, JSON.stringify(f));
  }, [f]);

  // Debounced search as you type.
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 350);
    return () => clearTimeout(t);
  }, [input]);

  const active = useMemo(() => journals.filter((j) => !j.archived), [journals]);
  const allTags = useMemo(() => [...new Set(active.flatMap((j) => j.tags))].sort(), [active]);

  // Filters are applied FIRST, then retrieval runs on what remains.
  const filtered = useMemo(() => active.filter((j) =>
    (!f.from || j.journalDate >= f.from) &&
    (!f.to || j.journalDate <= f.to) &&
    (!f.notebook || j.notebookId === f.notebook) &&
    (!f.tag || j.tags.includes(f.tag)) &&
    (!f.mood || j.mood === f.mood) &&
    (!f.favorites || j.favorite)), [active, f]);

  const results = useMemo(() => {
    if (!query) return [];
    const hits = keywordSearch(filtered, query);
    if (f.sort === "newest") hits.sort((a, b) => b.journal.journalDate.localeCompare(a.journal.journalDate));
    if (f.sort === "oldest") hits.sort((a, b) => a.journal.journalDate.localeCompare(b.journal.journalDate));
    return hits.slice(0, 20);
  }, [filtered, query, f.sort]);

  const terms = queryTerms(query);
  const qWords = query.toLowerCase().split(/[^a-z0-9']+/);
  const filterCount = Object.entries(f).filter(([k, v]) => k !== "sort" && v).length;

  const saved = savedMemoryIds.map((id) => journals.find((j) => j.id === id)).filter(Boolean) as Journal[];

  const onThisDay = useMemo(() => {
    if (!ready) return [];
    const md = today.slice(5);
    return active.filter((j) => j.journalDate.slice(5) === md && j.journalDate < today)
      .sort((a, b) => b.journalDate.localeCompare(a.journalDate));
  }, [active, ready, today]);

  const timeline = useMemo(() => {
    const groups = new Map<string, Journal[]>();
    [...filtered].sort((a, b) => b.journalDate.localeCompare(a.journalDate)).forEach((j) => {
      const k = fromISODate(j.journalDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      groups.set(k, [...(groups.get(k) ?? []), j]);
    });
    return [...groups.entries()];
  }, [filtered]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-3">Memory Vault</p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Find something you wrote before.</h1>

      <form role="search" onSubmit={(e) => { e.preventDefault(); setQuery(input.trim()); setTab("search"); }} className="mt-7">
        <label htmlFor="mv-q" className="sr-only">Describe the memory you’re looking for</label>
        <div className="flex items-center gap-3 rounded-full border border-line-2 bg-card px-5 shadow-soft focus-within:border-accent">
          <Search className="h-5 w-5 shrink-0 text-ink-3" aria-hidden />
          <input id="mv-q" value={input} onChange={(e) => setInput(e.target.value)} maxLength={300} autoFocus={!initialQuery}
            placeholder="Search your own journals"
            className="min-w-0 flex-1 bg-transparent py-4 font-serif text-lg text-ink outline-none placeholder:text-ink-3" />
        </div>
      </form>

      <nav aria-label="Memory Vault sections" className="-mx-5 mt-7 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-1 border-b border-line">
          {TABS.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => setTab(t.id)} aria-current={tab === t.id ? "page" : undefined}
                className={`-mb-px border-b-2 px-3 py-2.5 text-sm ${tab === t.id ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                {t.label}
                {t.id === "onthisday" && onThisDay.length > 0 && <span className="ml-1.5 rounded-full bg-accent-soft px-1.5 text-xs text-accent">{onThisDay.length}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {(tab === "search" || tab === "timeline") && (
        <details className="mt-5 rounded-lg border border-line" open={filterCount > 0}>
          <summary className="cursor-pointer list-none px-4 py-3 text-sm text-ink-2">
            Filters & sorting {filterCount > 0 && <span className="ml-1 text-accent">· {filterCount} active</span>}
          </summary>
          <div className="grid gap-4 border-t border-line p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Field label="From"><input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} className={inputCls} /></Field>
            <Field label="To"><input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} className={inputCls} /></Field>
            <Field label="Notebook">
              <select value={f.notebook} onChange={(e) => setF({ ...f, notebook: e.target.value })} className={inputCls}>
                <option value="">Any</option>{notebooks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
            </Field>
            <Field label="Tag">
              <select value={f.tag} onChange={(e) => setF({ ...f, tag: e.target.value })} className={inputCls}>
                <option value="">Any</option>{allTags.map((t) => <option key={t} value={t}>#{t}</option>)}
              </select>
            </Field>
            <Field label="Mood">
              <select value={f.mood} onChange={(e) => setF({ ...f, mood: e.target.value as Mood | "" })} className={inputCls}>
                <option value="">Any</option>{MOODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </Field>
            {tab === "search" && (
              <Field label="Sort by">
                <select value={f.sort} onChange={(e) => setF({ ...f, sort: e.target.value as Sort })} className={inputCls}>
                  <option value="relevance">Relevance</option><option value="newest">Newest</option><option value="oldest">Oldest</option>
                </select>
              </Field>
            )}
            <label className="flex items-center gap-2 self-end pb-2 text-ink-2">
              <input type="checkbox" checked={f.favorites} onChange={(e) => setF({ ...f, favorites: e.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />
              Favorites only
            </label>
            {filterCount > 0 && <button type="button" onClick={() => setF({ ...EMPTY, sort: f.sort })} className="self-end pb-2 text-left text-ink-3 underline underline-offset-4 hover:text-ink">Clear filters</button>}
          </div>
        </details>
      )}

      <div className="mt-6">
        {!ready ? <ListSkeleton /> : tab === "search" ? (
          !query ? (
            <div className="rounded-lg border border-dashed border-line-2 p-6 text-sm leading-relaxed text-ink-2">
              <p className="font-display text-lg text-ink">Ask in your own words.</p>
              <ul className="mt-3 space-y-1.5 font-serif text-base italic text-ink-2">
                {["When did I write about being nervous before my exams?", "Find something I wrote about my first trip with my friends.", "Show me memories where I talked about feeling proud."].map((s) => (
                  <li key={s}><button type="button" onClick={() => { setInput(s); setQuery(s); }} className="text-left hover:text-accent">“{s}”</button></li>
                ))}
              </ul>
            </div>
          ) : terms.length === 0 ? (
            <Empty title="Try describing the memory" body="Add a few words about who, where, or what happened." />
          ) : results.length === 0 ? (
            <Empty title="I couldn’t find a matching memory in your journals." body={filterCount ? "Some filters are active. Clearing them may help." : "Try different words, or browse the timeline."} />
          ) : (
            <>
              <p className="mb-3 flex items-start gap-2 text-xs leading-relaxed text-ink-3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                Preview search matches your words. Meaning-based search, which understands memories described differently, is being connected.
              </p>
              <ol className="space-y-3" aria-label={`${results.length} matching memories`}>
                {results.map(({ journal: j, matched, excerpt: ex }, i) => {
                  const words = qWords.filter((w) => matched.some((t) => w.startsWith(t) || t.startsWith(w.slice(0, 6))));
                  return (
                    <li key={j.id} className="rise rounded-lg border border-line bg-card p-5 sm:p-6" style={{ animationDelay: `${i * 40}ms` }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-display text-xl text-ink">{j.title || "Untitled"}</h2>
                          <p className="mt-0.5 text-sm text-ink-3">{formatMedium(j.journalDate)}</p>
                        </div>
                        <SaveBtn on={savedMemoryIds.includes(j.id)} onClick={() => toggleSavedMemory(j.id)} />
                      </div>
                      <blockquote className="mt-3 border-l-2 border-line-2 pl-4 font-serif text-[1.05rem] leading-relaxed text-ink-2">“{ex}”</blockquote>
                      {j.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{j.tags.map((t) => <Tag key={t} name={t} />)}</div>}
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-3">
                        <p className="text-xs leading-relaxed text-ink-3">
                          <span className="font-medium text-ink-2">Why this appeared · </span>
                          This entry contains the words {[...new Set(words)].map((w) => `“${w}”`).join(", ") || "from your search"}.
                        </p>
                        <Link href={`/writing/journal/${j.id}`} className={btnGhost}>Open Journal</Link>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )
        ) : tab === "saved" ? (
          saved.length === 0 ? <Empty title="No saved memories yet" body="Bookmark a journal or a search result to keep it here. Saved memories stay linked to the original journal." /> : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {saved.map((j) => <MemoryCard key={j.id} j={j} action={<SaveBtn on onClick={() => toggleSavedMemory(j.id)} />} />)}
            </ul>
          )
        ) : tab === "timeline" ? (
          timeline.length === 0 ? <Empty title="Your memories will appear here as you write." action={<Link href="/writing/journal/new" className={btnPrimary}>Write a Journal</Link>} /> : (
            <ol className="relative ml-2 border-l border-line pl-6 sm:ml-4 sm:pl-8">
              {timeline.map(([month, list]) => (
                <li key={month} className="pb-8">
                  <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-accent" aria-hidden />
                  <h2 className="font-display text-lg text-ink">{month}</h2>
                  <ul className="mt-3 space-y-2">
                    {list.map((j) => (
                      <li key={j.id}>
                        <Link href={`/writing/journal/${j.id}`} className="block rounded-md px-3 py-2.5 hover:bg-card">
                          <span className="flex items-center gap-2 text-xs text-ink-3">
                            {formatMedium(j.journalDate)} <MoodLabel mood={j.mood} />
                            {j.favorite && <Star className="h-3 w-3 fill-amber text-amber" aria-label="Favorite" />}
                          </span>
                          <span className="mt-0.5 block font-display text-[1.05rem] text-ink">{j.title || "Untitled"}</span>
                          <span className="mt-0.5 line-clamp-1 block font-serif text-ink-2">{excerpt(j.content, 120)}</span>
                          {j.tags.length > 0 && <span className="mt-1.5 flex flex-wrap gap-1">{j.tags.map((t) => <Tag key={t} name={t} />)}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )
        ) : (
          onThisDay.length === 0 ? <Empty title="No memories from this day in past years yet." body="When you’ve written on today’s date in an earlier year, it will appear here." /> : (
            <ul className="space-y-4">
              {onThisDay.map((j) => {
                const years = Math.round(daysBetween(j.journalDate, today) / 365.25);
                return (
                  <li key={j.id} className="rounded-lg border border-line bg-card p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-accent">{years} year{years === 1 ? "" : "s"} ago · {formatMedium(j.journalDate)}</p>
                    <h2 className="mt-2 font-display text-2xl text-ink">{j.title || "Untitled"}</h2>
                    <p className="mt-2 font-serif text-[1.05rem] leading-relaxed text-ink-2">You wrote: “{excerpt(j.content, 200)}”</p>
                    <Link href={`/writing/journal/${j.id}`} className={`${btnGhost} mt-4`}>Open Journal</Link>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

const inputCls = "mt-1 w-full rounded-md border border-line bg-card px-2.5 py-2 text-ink outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs text-ink-3">{label}{children}</label>;
}

function SaveBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} aria-label={on ? "Remove from saved memories" : "Save memory"} title={on ? "Saved" : "Save memory"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
      <Bookmark className={`h-4 w-4 ${on ? "fill-accent text-accent" : ""}`} />
    </button>
  );
}

function MemoryCard({ j, action }: { j: Journal; action: React.ReactNode }) {
  return (
    <li className="flex flex-col rounded-lg border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-ink-3">{formatMedium(j.journalDate)}</p>
          <h2 className="mt-0.5 font-display text-lg text-ink">{j.title || "Untitled"}</h2>
        </div>
        {action}
      </div>
      <p className="mt-2 line-clamp-3 flex-1 font-serif text-ink-2">{excerpt(j.content, 180)}</p>
      <Link href={`/writing/journal/${j.id}`} className="mt-3 text-sm text-accent underline-offset-4 hover:underline">Open Journal</Link>
    </li>
  );
}
