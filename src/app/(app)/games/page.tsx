"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/client";

type Kind = "sequence" | "pattern";
const SHAPES = ["●", "▲", "■", "◆"];
export default function Page() {
  const [kind, setKind] = useState<Kind>("sequence"); const [seq, setSeq] = useState<number[]>([]); const [step, setStep] = useState(0);
  const [displaying, setDisplaying] = useState(false); const [active, setActive] = useState(-1); const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState<number[]>([]); const [answer, setAnswer] = useState(-1); const [status, setStatus] = useState(""); const [startedAt, setStartedAt] = useState(0);
  const [results, setResults] = useState<{ game: string; score: number; created_at: string }[]>([]);
  useEffect(() => { void createClient().from("game_results").select("game,score,created_at").order("created_at", { ascending: false }).limit(10).then(({ data }) => setResults(data ?? [])); }, []);
  useEffect(() => { if (!displaying) return; let i = 0; const timer = window.setInterval(() => { setActive(i); window.setTimeout(() => setActive(-1), 450); i++; if (i >= seq.length) { window.clearInterval(timer); window.setTimeout(() => { setDisplaying(false); setStep(0); }, 650); } }, 750); return () => window.clearInterval(timer); }, [displaying, seq]);

  function startSequence() { const values = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4)); setKind("sequence"); setSeq(values); setStep(0); setScore(0); setStartedAt(Date.now()); setStatus("Watch the sequence, then repeat it."); setDisplaying(true); }
  function pressSequence(value: number) {
    if (displaying || !seq.length) return;
    if (seq[step] !== value) { setStatus(`Round ended. You recalled ${score} of ${seq.length} steps.`); void save("sequence-recall", score, { recalled: score, length: seq.length }); setSeq([]); return; }
    const next = step + 1; setScore(next); setStep(next);
    if (next === seq.length) { setStatus("Perfect recall. You got the whole sequence."); void save("sequence-recall", next, { recalled: next, length: seq.length }); setSeq([]); }
  }
  function startPattern() { const start = Math.floor(Math.random() * 4); const values = Array.from({ length: 5 }, (_, i) => (start + i) % 4); setKind("pattern"); setPattern(values); setAnswer(values[4]); setStartedAt(Date.now()); setStatus("Pick the shape that continues the pattern."); setScore(0); }
  function choosePattern(value: number) { if (!pattern.length) return; const correct = value === answer; setScore(correct ? 1 : 0); setStatus(correct ? "Correct. The sequence moves to the next shape each time." : "That one doesn’t fit. The sequence moves to the next shape each time."); void save("pattern-match", correct ? 1 : 0, { correct, pattern: pattern.slice(0, 4) }); setPattern([]); }
  async function save(game: string, points: number, details: object) {
    const client = createClient();
    await client.from("game_results").insert({ game, score: points, duration_ms: Math.max(0, Date.now() - startedAt), details });
    const { data: rows } = await client.from("game_results").select("game,score,created_at").order("created_at", { ascending: false }).limit(10); if (rows) setResults(rows);
  }
  return <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
    <PageHeader eyebrow="Cognitive practice" title="A little practice, at your pace" />
    <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-2">Short activities for attention and working memory. Your scores help you see your own practice history; they are not tests or measures of cognitive health.</p>
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-line bg-card p-5 sm:p-6"><h2 className="font-display text-xl text-ink">Sequence Recall</h2><p className="mt-1 text-sm text-ink-3">Watch five shapes light up, then repeat their order.</p><div className="mt-5 grid grid-cols-4 gap-2">{SHAPES.map((shape, i) => <button key={shape} disabled={!seq.length || displaying} onClick={() => pressSequence(i)} aria-label={`Shape ${i + 1}`} className={`flex aspect-square items-center justify-center rounded-lg border border-line text-3xl transition-colors ${active === i ? "bg-accent text-paper" : "bg-paper-2 text-ink"}`}>{shape}</button>)}</div><button onClick={startSequence} disabled={displaying} className="mt-4 w-full rounded-full bg-ink px-4 py-3 text-sm text-paper disabled:opacity-50">{displaying ? "Watch closely…" : "Start sequence"}</button></section>
      <section className="rounded-lg border border-line bg-card p-5 sm:p-6"><h2 className="font-display text-xl text-ink">Pattern Match</h2><p className="mt-1 text-sm text-ink-3">Find the shape that comes next in a repeating pattern.</p><div className="mt-7 flex min-h-20 items-center justify-center gap-3 text-3xl text-ink">{pattern.length ? <>{pattern.slice(0, 4).map((x, i) => <span key={i}>{SHAPES[x]}</span>)}<span className="text-accent">?</span></> : <span className="text-sm text-ink-3">Start when you’re ready</span>}</div><div className="mt-3 grid grid-cols-4 gap-2">{SHAPES.map((shape, i) => <button key={shape} disabled={!pattern.length} onClick={() => choosePattern(i)} className="rounded-md border border-line bg-paper-2 py-3 text-2xl text-ink disabled:opacity-50">{shape}</button>)}</div><button onClick={startPattern} disabled={!!pattern.length} className="mt-4 w-full rounded-full bg-ink px-4 py-3 text-sm text-paper disabled:opacity-50">New pattern</button></section>
    </div>
    {status && <p role="status" className="mt-4 rounded-md border border-line bg-paper-2 p-4 text-sm text-ink-2">{status}</p>}
    <section className="mt-10"><h2 className="font-display text-2xl text-ink">Recent practice</h2>{results.length ? <div className="mt-3 overflow-hidden rounded-lg border border-line bg-card">{results.map((r, i) => <div key={`${r.created_at}-${i}`} className="flex justify-between gap-3 border-b border-line px-4 py-3 text-sm last:border-b-0"><span className="text-ink">{r.game === "sequence-recall" ? "Sequence Recall" : "Pattern Match"}</span><span className="text-ink-3">Score {r.score} · {new Date(r.created_at).toLocaleDateString()}</span></div>)}</div> : <p className="mt-3 rounded-lg border border-line p-5 text-sm text-ink-3">Your completed rounds will appear here.</p>}</section>
    <p className="mt-8 text-xs leading-5 text-ink-3">These activities are for engagement and practice. Results do not diagnose, prevent, or treat any health condition.</p>
  </div>;
}
