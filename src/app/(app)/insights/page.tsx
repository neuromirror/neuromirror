"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/app-shell";

type Analysis = { summary: string; trend?: { label: string; summary: string }; observations: { area: string; finding: string; evidence: string; caveat: string }[]; reflectionQuestions: string[]; disclaimer: string };
type Saved = { id: string; created_at: string; analysis: Analysis; journals: { title: string; journal_date: string } | null };

export default function Page() {
  const { journals } = useStore(); const [selected, setSelected] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null); const [history, setHistory] = useState<Saved[]>([]);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  useEffect(() => { void createClient().from("cognitive_insights").select("id,created_at,analysis,journals(title,journal_date)").order("created_at", { ascending: false }).limit(12).then(({ data }) => setHistory((data ?? []) as unknown as Saved[])); }, []);
  async function analyze() {
    setBusy(true); setError(""); setAnalysis(null);
    try {
      const response = await fetch("/api/analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ journalId: selected }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Analysis failed.");
      setAnalysis(data.analysis);
      const result = await createClient().from("cognitive_insights").select("id,created_at,analysis,journals(title,journal_date)").order("created_at", { ascending: false }).limit(12);
      if (result.data) setHistory(result.data as unknown as Saved[]);
    } catch (e) { setError(e instanceof Error ? e.message : "Analysis failed."); }
    finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
    <PageHeader eyebrow="Cognitive health" title="Writing patterns, over time" />
      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-2">Build a personal history of writing patterns over time. Each report uses the journal you select and can compare it with up to five earlier analysis summaries. These are informational reflections, not a medical assessment; changes in writing have many causes.</p>
    <section className="mt-8 rounded-lg border border-line bg-card p-5 sm:p-6">
      <h2 className="font-display text-xl text-ink">Analyze a journal</h2>
      <p className="mt-1 text-sm text-ink-3">When you ask, the selected entry and up to five of your earlier saved analysis summaries are sent to Gemini. Other journal entries are not included. Autosave never runs analysis.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select value={selected} onChange={e => setSelected(e.target.value)} className="min-w-0 flex-1 rounded-md border border-line-2 bg-paper px-3 py-3 text-sm text-ink">
          <option value="">Choose one of your journals</option>{journals.map(j => <option key={j.id} value={j.id}>{j.journalDate} · {j.title || "Untitled journal"}</option>)}
        </select>
        <button disabled={!selected || busy} onClick={analyze} className="rounded-full bg-ink px-5 py-3 text-sm text-paper disabled:opacity-50">{busy ? "Analyzing…" : "Analyze this entry"}</button>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-clay">{error}</p>}
    </section>
    {analysis && <AnalysisCard analysis={analysis} />}
    <section className="mt-10">
      <h2 className="font-display text-2xl text-ink">Your analysis history</h2>
      {history.length ? <div className="mt-4 space-y-3">{history.map(item => <details key={item.id} className="rounded-lg border border-line bg-card p-4"><summary className="cursor-pointer text-sm text-ink">{item.journals?.journal_date ?? new Date(item.created_at).toLocaleDateString()} · {item.journals?.title || "Journal analysis"}</summary><div className="pt-3"><AnalysisCard analysis={item.analysis} compact /></div></details>)}</div> : <p className="mt-3 rounded-lg border border-line p-5 text-sm text-ink-3">No analyses yet. Choose a journal above to start building your personal writing-pattern history.</p>}
    </section>
    <p className="mt-8 border-t border-line pt-4 text-xs leading-5 text-ink-3">Voice analysis is not available. Written language alone cannot establish cognitive health or diagnose any condition.</p>
  </div>;
}

function AnalysisCard({ analysis, compact = false }: { analysis: Analysis; compact?: boolean }) {
  return <section className={`${compact ? "mt-0" : "mt-8"} rounded-lg border border-line bg-card p-5 sm:p-6`}>
    {!compact && <h2 className="font-display text-xl text-ink">Observations</h2>}
    <p className="mt-2 text-sm leading-6 text-ink-2">{analysis.summary}</p>
    {analysis.trend && <div className="mt-4 rounded-md border border-line bg-paper-2 p-4"><p className="text-xs uppercase tracking-[0.14em] text-ink-3">{analysis.trend.label}</p><p className="mt-1 text-sm leading-5 text-ink-2">{analysis.trend.summary}</p></div>}
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{analysis.observations.map((o, i) => <article key={`${o.area}-${i}`} className="rounded-md bg-paper-2 p-4"><h3 className="text-sm font-medium text-ink">{o.area}</h3><p className="mt-1 text-sm leading-5 text-ink-2">{o.finding}</p>{o.evidence && <p className="mt-2 text-xs text-ink-3">Text evidence: “{o.evidence}”</p>}<p className="mt-2 text-xs text-ink-3">{o.caveat}</p></article>)}</div>
    {!!analysis.reflectionQuestions?.length && <div className="mt-5"><h3 className="text-sm font-medium text-ink">Questions for reflection</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">{analysis.reflectionQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>}
    <p className="mt-5 border-t border-line pt-3 text-xs leading-5 text-ink-3">{analysis.disclaimer}</p>
  </section>;
}
