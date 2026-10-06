"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { useStore } from "@/lib/store";

const countWords = (value: string) => value.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;

export default function Page() {
  const { ready, journals, notes } = useStore();
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const report = useMemo(() => {
    const inRange = (date: string) => (!from || date >= from) && (!to || date <= to);
    const js = journals.filter(j => inRange(j.journalDate));
    const ns = notes.filter(n => inRange(n.createdAt.slice(0, 10)));
    const moodCounts = js.reduce<Record<string, number>>((a, j) => { if (j.mood) a[j.mood] = (a[j.mood] ?? 0) + 1; return a; }, {});
    return { journals: js.length, notes: ns.length, words: [...js, ...ns].reduce((n, e) => n + countWords(e.content), 0), moods: Object.entries(moodCounts).sort((a, b) => b[1] - a[1]) };
  }, [journals, notes, from, to]);
  return <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
    <PageHeader eyebrow="Reports" title="Your writing, at a glance"><button onClick={() => window.print()} disabled={!ready} className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper disabled:opacity-50">Print report</button></PageHeader>
    <p className="mt-4 text-sm leading-6 text-ink-2">A summary calculated from your own journals and notes. Your writing text is never included in this report.</p>
    <section className="mt-7 rounded-lg border border-line bg-card p-5"><h2 className="font-display text-lg text-ink">Date range</h2><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center"><label className="text-sm text-ink-2">From <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="ml-2 rounded border border-line bg-paper px-2 py-2 text-ink" /></label><label className="text-sm text-ink-2">To <input type="date" value={to} onChange={e => setTo(e.target.value)} className="ml-2 rounded border border-line bg-paper px-2 py-2 text-ink" /></label><button onClick={() => { setFrom(""); setTo(""); }} className="text-left text-sm text-accent underline">All time</button></div></section>
    <section aria-label="Report totals" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{[["Journals", report.journals], ["Notes", report.notes], ["Words written", report.words]].map(([label, value]) => <div key={label} className="rounded-lg border border-line bg-card p-5"><p className="text-xs uppercase tracking-wide text-ink-3">{label}</p><p className="mt-2 font-display text-3xl text-ink">{ready ? value : "—"}</p></div>)}</section>
    <section className="mt-5 rounded-lg border border-line bg-card p-5"><h2 className="font-display text-xl text-ink">Self-reported moods</h2>{report.moods.length ? <ul className="mt-3 divide-y divide-line">{report.moods.map(([mood, n]) => <li key={mood} className="flex justify-between py-2 text-sm capitalize text-ink-2"><span>{mood}</span><span>{n} journal{n === 1 ? "" : "s"}</span></li>)}</ul> : <p className="mt-2 text-sm text-ink-3">No moods were recorded in this period.</p>}</section>
    <p className="mt-6 text-xs leading-5 text-ink-3">These totals describe your writing activity only. Mood labels are self-reported. They do not measure cognitive ability or indicate health status.</p>
    <style jsx global>{`@media print { aside, header, nav, button { display: none !important; } main { padding: 0 !important; } body { background: white !important; } }`}</style>
  </div>;
}
