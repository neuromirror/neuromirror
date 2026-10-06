// Milestone 1 retrieval: transparent keyword scoring over the user's own
// journals. In the Gemini milestone this becomes the candidate-retrieval
// stage (step 5 of the pipeline in PLAN.md) before AI ranking.

import { htmlToText } from "./text";
import type { Journal } from "./types";

const STOP = new Set(
  "a an and are about as at be before by did do find for from had have i in is it me memories memory my of on or show something that the to was we went were what when where which who with wrote write writing journal journals entry entries talked talk about".split(" "),
);

const stem = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);

export function queryTerms(q: string): string[] {
  return [...new Set(q.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem))].filter(Boolean);
}

export interface KeywordHit {
  journal: Journal;
  score: number;
  matched: string[];
  excerpt: string;
}

export function keywordSearch(journals: Journal[], q: string): KeywordHit[] {
  const terms = queryTerms(q);
  if (!terms.length) return [];
  const hits: KeywordHit[] = [];
  for (const j of journals) {
    const text = htmlToText(j.content);
    const words = (j.title + " " + text + " " + j.tags.join(" ")).split(/\s+/).map(stem);
    const matched = terms.filter((t) => words.some((w) => w.startsWith(t)));
    if (!matched.length) continue;
    const titleBoost = terms.filter((t) => j.title.split(/\s+/).map(stem).some((w) => w.startsWith(t))).length;
    // Excerpt is always a verbatim sentence from the entry.
    const sentences = text.split(/(?<=[.!?])\s+/);
    const best = sentences.find((s) => s.split(/\s+/).map(stem).some((w) => matched.some((t) => w.startsWith(t)))) ?? sentences[0] ?? "";
    hits.push({ journal: j, score: matched.length * 2 + titleBoost, matched, excerpt: best.length > 220 ? best.slice(0, 220) + "…" : best });
  }
  return hits.sort((a, b) => b.score - a.score);
}
