"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Bookmark,
  Check,
  Lightbulb,
  Loader2,
  Palette,
  PenTool,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { formatLong, isValidISODate } from "@/lib/dates";
import { useStore } from "@/lib/store";
import { MOODS, type Journal, type Mood, type Note, type PaperStyle, type FontTheme, type AccentColor } from "@/lib/types";
import { RichEditor } from "./rich-editor";
import { FreeformCanvas } from "./freeform-canvas";
import { analyzeWritingLocally, type CognitiveAnalysisResult } from "@/lib/cognitive-analyzer";
import { createClient } from "@/lib/supabase/client";
import { Empty, Skeleton, btnGhost, btnPrimary } from "./ui";

type Draft = Journal | Note;
type Status = "idle" | "dirty" | "saving" | "saved" | "invalid" | "error";

const MAX_TITLE = 200;
const MAX_CONTENT = 500_000;

const PROMPTS = [
  "What made me pause and feel grateful today?",
  "What is one challenge I navigated, and what did it teach me?",
  "What thought or emotion has been lingering in my mind most?",
  "What drained my energy today, and what restored it?",
  "If today was a chapter in my journey, what would its title be?",
];

const PAPER_STYLES: { id: PaperStyle; label: string; class: string }[] = [
  { id: "plain", label: "Clean Card", class: "paper-plain" },
  { id: "ruled", label: "Ruled Lines", class: "paper-ruled" },
  { id: "grid", label: "Dot Grid", class: "paper-grid" },
  { id: "parchment", label: "Parchment", class: "paper-parchment" },
  { id: "slate", label: "Midnight Slate", class: "paper-slate" },
  { id: "sepia", label: "Warm Sepia", class: "paper-sepia" },
];

const FONT_THEMES: { id: FontTheme; label: string; class: string }[] = [
  { id: "sans", label: "Clean Sans", class: "font-theme-sans" },
  { id: "serif", label: "Literary Serif", class: "font-theme-serif" },
  { id: "mono", label: "Focus Mono", class: "font-theme-mono" },
  { id: "handwriting", label: "Handwritten", class: "font-theme-handwriting" },
];

export function EntryEditor({ kind, id, presetDate, presetNotebook }: { kind: "journal" | "note"; id: string; presetDate: string | null; presetNotebook?: string | null }) {
  const store = useStore();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // New Personalization & Tools States
  const [showCanvas, setShowCanvas] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [newNotebookInput, setNewNotebookInput] = useState("");
  const [notebookBusy, setNotebookBusy] = useState(false);
  const [notebookNotice, setNotebookNotice] = useState("");

  const [paperStyle, setPaperStyle] = useState<PaperStyle>("plain");
  const [fontTheme, setFontTheme] = useState<FontTheme>("sans");

  // Cognitive Analysis State
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<CognitiveAnalysisResult | null>(null);
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const draftRef = useRef<Draft | null>(null);
  const persisted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialise the draft once the store is ready.
  useEffect(() => {
    if (!store.ready || draftRef.current) return;
    const stamp = new Date().toISOString().slice(0, 19);
    let d: Draft | undefined;
    if (id === "new") {
      const base = { id: store.newId(kind === "journal" ? "j" : "n"), title: "", content: "", notebookId: presetNotebook || null, tags: [], favorite: false, archived: false, createdAt: stamp, updatedAt: stamp };
      d = kind === "journal"
        ? { ...base, kind, journalDate: presetDate && isValidISODate(presetDate) ? presetDate : store.today, mood: null }
        : { ...base, kind, deadline: null, completed: false };
    } else {
      d = kind === "journal" ? store.journals.find((j) => j.id === id) : store.notes.find((n) => n.id === id);
      persisted.current = !!d;
    }
    if (!d) return setMissing(true);
    draftRef.current = d;
    setDraft(d);

    // Parse persisted style metadata if embedded in content
    if (d.content.includes("data-paper-style=\"ruled\"")) setPaperStyle("ruled");
    else if (d.content.includes("data-paper-style=\"grid\"")) setPaperStyle("grid");
    else if (d.content.includes("data-paper-style=\"parchment\"")) setPaperStyle("parchment");
    else if (d.content.includes("data-paper-style=\"slate\"")) setPaperStyle("slate");
    else if (d.content.includes("data-paper-style=\"sepia\"")) setPaperStyle("sepia");

    if (d.content.includes("data-font-theme=\"serif\"")) setFontTheme("serif");
    else if (d.content.includes("data-font-theme=\"mono\"")) setFontTheme("mono");
    else if (d.content.includes("data-font-theme=\"handwriting\"")) setFontTheme("handwriting");
  }, [store.ready, store.journals, store.notes, store.today, store, id, kind, presetDate]);

  const { saveJournal, saveNote } = store;
  const save = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const d = draftRef.current;
    if (!d) return;
    if (d.kind === "journal" && !isValidISODate(d.journalDate)) return setStatus("invalid");
    // Don't create empty records for a brand-new entry nobody has typed in yet.
    if (!persisted.current && !d.title.trim() && !d.content.replace(/<[^>]*>/g, "").trim()) return setStatus("idle");
    setStatus("saving");
    const clean = { ...d, title: d.title.slice(0, MAX_TITLE), content: d.content.slice(0, MAX_CONTENT) };
    void (async () => {
      try {
        if (clean.kind === "journal") await saveJournal(clean);
        else await saveNote(clean);
        if (!persisted.current) {
          persisted.current = true;
          window.history.replaceState(null, "", `/writing/${d.kind}/${d.id}`);
        }
        setStatus("saved"); setSavedAt(Date.now());
      } catch {
        setStatus("error");
      }
    })();
  }, [saveJournal, saveNote]);

  const update = useCallback((patch: Partial<Journal> | Partial<Note>, immediate = false) => {
    const next = { ...draftRef.current!, ...patch } as Draft;
    draftRef.current = next;
    setDraft(next);
    setStatus("dirty");
    if (timer.current) clearTimeout(timer.current);
    if (immediate) save();
    else timer.current = setTimeout(save, 900);
  }, [save]);

  // Handle Stylus / Freeform Drawing
  const handleInsertDrawing = (dataUrl: string) => {
    if (!dataUrl) return;
    const imgHtml = `<p><img src="${dataUrl}" alt="Stylus drawing" style="max-width: 100%; border-radius: 8px; margin: 12px 0;" /></p>`;
    const updatedContent = (draftRef.current?.content || "") + imgHtml;
    update({ content: updatedContent }, true);
    setShowCanvas(false);
  };

  const handleSaveCanvasAsPage = async (dataUrl: string) => {
    if (!dataUrl) return;
    const stamp = new Date().toISOString();
    const newJournalId = store.newId("j");
    const sketchJournal: Journal = {
      kind: "journal",
      id: newJournalId,
      title: `Freeform Sketch · ${store.today}`,
      content: `<p><img src="${dataUrl}" alt="Freeform sketch" style="max-width: 100%; border-radius: 8px;" /></p>`,
      journalDate: store.today,
      mood: "creative",
      notebookId: draftRef.current?.notebookId || null,
      tags: ["freeform", "sketch"],
      favorite: false,
      archived: false,
      createdAt: stamp,
      updatedAt: stamp,
    };
    try {
      await store.saveJournal(sketchJournal);
      setShowCanvas(false);
      router.push(`/writing/journal/${newJournalId}`);
    } catch {
      alert("Could not save freeform sketch journal. Please retry.");
    }
  };

  // Handle Quick Inline Notebook Creation
  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotebookNotice("");
    if (!newNotebookInput.trim()) return;
    setNotebookBusy(true);
    try {
      const created = await store.createNotebook(newNotebookInput.trim());
      update({ notebookId: created.id }, true);
      setNewNotebookInput("");
      setShowNewNotebook(false);
    } catch (err) {
      setNotebookNotice(err instanceof Error ? err.message : "Could not create notebook.");
    } finally {
      setNotebookBusy(false);
    }
  };

  // Run Cognitive Analysis Directly Inside the Editor
  const handleAnalyzeEntry = async () => {
    const d = draftRef.current;
    if (!d) return;
    setShowAnalysis(true);
    setAnalysisBusy(true);
    setAnalysisError("");
    setAnalysisData(null);

    try {
      // First try Edge Function if entry is persisted
      if (persisted.current && d.kind === "journal") {
        try {
          const client = createClient();
          const { data, error } = await client.functions.invoke("cognitive-analysis", {
            body: { journalId: d.id },
          });
          if (!error && data?.analysis) {
            setAnalysisData(data.analysis);
            setAnalysisBusy(false);
            return;
          }
        } catch {
          // Fall back gracefully to local cognitive linguistic analysis
        }
      }

      // Local heuristic linguistic analysis fallback
      const localResult = analyzeWritingLocally(d.title, d.content);
      setAnalysisData(localResult);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis could not be completed.");
    } finally {
      setAnalysisBusy(false);
    }
  };

  // Apply Prompt
  const handleApplyPrompt = (promptText: string) => {
    const d = draftRef.current;
    if (!d) return;
    const promptHtml = `<p><strong>${promptText}</strong></p><p></p>`;
    const nextContent = d.content ? `${d.content}${promptHtml}` : promptHtml;
    update({ content: nextContent }, true);
    setShowPrompts(false);
  };

  // Paper & Font Style update
  const handleSetPaper = (p: PaperStyle) => {
    setPaperStyle(p);
    // embed data attribute in content tag
    const current = draftRef.current?.content || "";
    const clean = current.replace(/data-paper-style="[^"]*"/g, "");
    update({ content: `${clean}<!-- data-paper-style="${p}" -->` });
  };

  const handleSetFont = (f: FontTheme) => {
    setFontTheme(f);
    const current = draftRef.current?.content || "";
    const clean = current.replace(/data-font-theme="[^"]*"/g, "");
    update({ content: `${clean}<!-- data-font-theme="${f}" -->` });
  };

  // Cmd/Ctrl+S saves now; warn before leaving with unsaved changes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (status === "dirty" || status === "invalid" || status === "error") e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, status]);

  // Flush pending edits when navigating away inside the app.
  useEffect(() => () => {
    if (timer.current) {
      clearTimeout(timer.current);
      save();
    }
  }, [save]);

  if (missing) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <Empty title="This entry isn’t available" body="It may have been deleted, or it doesn’t belong to your account."
          action={<Link href="/writing" className={btnPrimary}>Back to Writing</Link>} />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-10 sm:px-8" role="status" aria-label="Loading entry">
        <Skeleton className="h-4 w-32" /><Skeleton className="h-10 w-2/3" /><Skeleton className="h-9" />
        <Skeleton className="h-4" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  const isJournal = draft.kind === "journal";
  const dateInvalid = isJournal && !isValidISODate(draft.journalDate);
  const saved = isJournal && store.savedMemoryIds.includes(draft.id);

  const activePaperClass = PAPER_STYLES.find((p) => p.id === paperStyle)?.class || "paper-plain";
  const activeFontClass = FONT_THEMES.find((f) => f.id === fontTheme)?.class || "font-theme-sans";

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8 lg:py-10">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Link href={isJournal ? "/writing?view=journals" : "/writing?view=notes"} className="-ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm text-ink-3 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> {isJournal ? "Journals" : "Notes"}
        </Link>
        <SaveStatus status={status} savedAt={savedAt} />

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {/* Analyze with AI Button */}
          <button
            type="button"
            onClick={handleAnalyzeEntry}
            title="Analyze Entry with Cognitive AI"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium text-ink hover:border-accent hover:text-accent transition shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="hidden sm:inline">Analyze</span>
          </button>

          {/* Stylus / Drawing Button */}
          <button
            type="button"
            onClick={() => setShowCanvas(true)}
            title="Open Stylus & Drawing Canvas"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper-2 transition"
          >
            <PenTool className="h-3.5 w-3.5 text-ink-2" />
            <span className="hidden sm:inline">Stylus</span>
          </button>

          {/* Personalization Options */}
          <button
            type="button"
            onClick={() => setShowPersonalize(!showPersonalize)}
            title="Personalize Paper & Font"
            aria-pressed={showPersonalize}
            className={`grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink ${showPersonalize ? "bg-paper-2 text-accent" : ""}`}
          >
            <Palette className="h-4 w-4" />
          </button>

          {/* Prompts Drawer */}
          <button
            type="button"
            onClick={() => setShowPrompts(!showPrompts)}
            title="Writing Prompts"
            aria-pressed={showPrompts}
            className={`grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink ${showPrompts ? "bg-paper-2 text-amber" : ""}`}
          >
            <Lightbulb className="h-4 w-4" />
          </button>

          {isJournal && persisted.current && (
            <button type="button" onClick={() => store.toggleSavedMemory(draft.id)} aria-pressed={saved}
              title={saved ? "Remove from saved memories" : "Save to Memory Vault"} aria-label={saved ? "Remove from saved memories" : "Save to Memory Vault"}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
              <Bookmark className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
            </button>
          )}

          <button type="button" onClick={() => update({ favorite: !draft.favorite }, true)} aria-pressed={draft.favorite}
            aria-label={draft.favorite ? "Remove from favorites" : "Add to favorites"} title="Favorite"
            className="grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
            <Star className={`h-4 w-4 ${draft.favorite ? "fill-amber text-amber" : ""}`} />
          </button>

          <button type="button" onClick={() => update({ archived: !draft.archived }, true)}
            aria-label={draft.archived ? "Restore from archive" : "Archive"} title={draft.archived ? "Restore" : "Archive"}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
            {draft.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </button>

          {persisted.current && (
            <button type="button" onClick={() => setConfirmDelete(true)} aria-label="Delete" title="Delete"
              className="grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-clay-soft hover:text-clay">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Personalization Dropdown Panel */}
      {showPersonalize && (
        <div className="mt-4 rounded-xl border border-line bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Journal Personalization</h3>
            <button type="button" onClick={() => setShowPersonalize(false)} className="text-ink-3 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-ink-2 mb-2">Paper Background</label>
              <div className="grid grid-cols-3 gap-2">
                {PAPER_STYLES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSetPaper(p.id)}
                    className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition text-left ${
                      paperStyle === p.id ? "border-accent bg-paper-2 font-semibold text-ink" : "border-line bg-paper text-ink-2 hover:border-line-2"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-2 mb-2">Typography Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_THEMES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSetFont(f.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition text-left ${
                      fontTheme === f.id ? "border-accent bg-paper-2 font-semibold text-ink" : "border-line bg-paper text-ink-2 hover:border-line-2"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Prompts Drawer */}
      {showPrompts && (
        <div className="mt-4 rounded-xl border border-line bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2">Reflection Inquiries</h3>
            </div>
            <button type="button" onClick={() => setShowPrompts(false)} className="text-ink-3 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-ink-3 mb-3">Click any reflection question to add it directly to your journal:</p>
          <div className="space-y-1.5">
            {PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPrompt(prompt)}
                className="w-full text-left rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink-2 hover:border-accent hover:text-ink transition"
              >
                “{prompt}”
              </button>
            ))}
          </div>
        </div>
      )}

      {draft.archived && (
        <p className="mt-3 rounded-md bg-paper-2 px-3 py-2 text-sm text-ink-2">
          This {draft.kind} is archived. It’s hidden from your main lists but nothing is lost.
        </p>
      )}

      {/* Title */}
      <div className="mt-6">
        {isJournal && (
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-ink-3">{dateInvalid ? "Journal" : formatLong(draft.journalDate)}</p>
        )}
        <label htmlFor="entry-title" className="sr-only">Title</label>
        <input id="entry-title" value={draft.title} maxLength={MAX_TITLE} onChange={(e) => update({ title: e.target.value })}
          placeholder={isJournal ? "Give this day a title" : "Untitled note"}
          className={`w-full bg-transparent font-display text-3xl leading-tight text-ink outline-none placeholder:text-ink-3/70 sm:text-4xl ${activeFontClass}`} />
      </div>

      {/* Metadata Filters & Settings */}
      <div className="mt-5 flex flex-wrap items-start gap-x-6 gap-y-3 text-sm">
        {isJournal ? (
          <div>
            <label htmlFor="j-date" className="block text-xs text-ink-3">Journal date <span aria-hidden>*</span></label>
            <input id="j-date" type="date" required value={draft.journalDate}
              onChange={(e) => update({ journalDate: e.target.value })}
              aria-invalid={dateInvalid} aria-describedby={dateInvalid ? "j-date-err" : undefined}
              className={`mt-1 rounded-md border bg-card px-2.5 py-1.5 text-ink outline-none focus:border-accent ${dateInvalid ? "border-clay" : "border-line"}`} />
            {dateInvalid && <p id="j-date-err" role="alert" className="mt-1 text-xs text-clay">Every journal needs a date. Choose one to save.</p>}
          </div>
        ) : (
          <div>
            <label htmlFor="n-deadline" className="block text-xs text-ink-3">Deadline (optional)</label>
            <div className="mt-1 flex items-center gap-1">
              <input id="n-deadline" type="date" value={draft.deadline ?? ""}
                onChange={(e) => update({ deadline: e.target.value && isValidISODate(e.target.value) ? e.target.value : null })}
                className="rounded-md border border-line bg-card px-2.5 py-1.5 text-ink outline-none focus:border-accent" />
              {draft.deadline && (
                <button type="button" onClick={() => update({ deadline: null }, true)} aria-label="Remove deadline"
                  className="grid h-8 w-8 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink"><X className="h-4 w-4" /></button>
              )}
            </div>
          </div>
        )}

        {isJournal && (
          <div>
            <label htmlFor="j-mood" className="block text-xs text-ink-3">Mood</label>
            <select id="j-mood" value={draft.mood ?? ""} onChange={(e) => update({ mood: (e.target.value || null) as Mood | null }, true)}
              className="mt-1 rounded-md border border-line bg-card px-2.5 py-1.5 text-ink outline-none focus:border-accent">
              <option value="">Not set</option>
              {MOODS.map((m) => <option key={m.value} value={m.value}>{m.glyph} {m.label}</option>)}
            </select>
          </div>
        )}

        {/* Notebook with Inline Create */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="e-nb" className="block text-xs text-ink-3">Notebook</label>
            <button
              type="button"
              onClick={() => setShowNewNotebook(!showNewNotebook)}
              className="text-xs text-accent hover:underline flex items-center gap-0.5"
            >
              <Plus className="h-3 w-3" /> New
            </button>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <select id="e-nb" value={draft.notebookId ?? ""} onChange={(e) => update({ notebookId: e.target.value || null }, true)}
              className="rounded-md border border-line bg-card px-2.5 py-1.5 text-ink outline-none focus:border-accent min-w-[140px]">
              <option value="">None</option>
              {store.notebooks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
        </div>

        {!isJournal && draft.deadline && (
          <label className="mt-5 flex items-center gap-2 text-ink-2">
            <input type="checkbox" checked={draft.completed} onChange={(e) => update({ completed: e.target.checked }, true)}
              className="h-4 w-4 accent-[var(--accent)]" />
            Completed
          </label>
        )}
      </div>

      {/* Inline Quick Notebook Modal */}
      {showNewNotebook && (
        <form onSubmit={handleCreateNotebook} className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-card p-3 shadow-xs">
          <input
            type="text"
            required
            autoFocus
            maxLength={80}
            placeholder="Notebook title..."
            value={newNotebookInput}
            onChange={(e) => setNewNotebookInput(e.target.value)}
            className="flex-1 rounded-md border border-line-2 bg-paper px-3 py-1.5 text-xs text-ink outline-none focus:border-accent"
          />
          <button disabled={notebookBusy || !newNotebookInput.trim()} type="submit" className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper disabled:opacity-50">
            {notebookBusy ? "Creating…" : "Save Notebook"}
          </button>
          <button type="button" onClick={() => setShowNewNotebook(false)} className="text-xs text-ink-3 hover:text-ink px-1.5">
            Cancel
          </button>
          {notebookNotice && <p className="text-xs text-clay">{notebookNotice}</p>}
        </form>
      )}

      <TagInput tags={draft.tags} onChange={(tags) => update({ tags }, true)} />

      {/* Editor Container with Custom Paper & Font */}
      <div className={`mt-6 rounded-2xl border border-line p-4 sm:p-6 transition-colors shadow-xs ${activePaperClass} ${activeFontClass}`}>
        <RichEditor
          key={draft.id}
          initial={draft.content}
          placeholder={isJournal ? "What happened today? What is on your mind?" : "Capture an idea, task, reminder, or thought."}
          onChange={(html) => update({ content: html })}
          onOpenDrawing={() => setShowCanvas(true)}
        />
      </div>

      {/* Stylus / Freeform Drawing Modal */}
      {showCanvas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl h-[85vh] max-h-[720px]">
            <FreeformCanvas
              onSaveAsImage={handleInsertDrawing}
              onSaveAsPage={handleSaveCanvasAsPage}
              onClose={() => setShowCanvas(false)}
            />
          </div>
        </div>
      )}

      {/* In-Editor Cognitive Analysis Modal */}
      {showAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl text-ink">Cognitive Analysis & Observations</h2>
              </div>
              <button type="button" onClick={() => setShowAnalysis(false)} className="rounded-md p-1.5 text-ink-3 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              {analysisBusy ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent" />
                  <p className="text-sm text-ink-2">Reflecting on cognitive language patterns and rhythm…</p>
                </div>
              ) : analysisError ? (
                <div className="py-6">
                  <p className="text-sm text-clay">{analysisError}</p>
                  <button onClick={handleAnalyzeEntry} className={`${btnPrimary} mt-4`}>Retry Analysis</button>
                </div>
              ) : analysisData ? (
                <div className="space-y-5">
                  <div className="rounded-lg bg-paper p-4 border border-line">
                    <p className="text-sm leading-relaxed text-ink">{analysisData.summary}</p>
                    {analysisData.trend && (
                      <div className="mt-3 pt-3 border-t border-line">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">{analysisData.trend.label}</span>
                        <p className="text-xs text-ink-2 mt-0.5">{analysisData.trend.summary}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-2.5">Key Language Observations</h3>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {analysisData.observations.map((obs, i) => (
                        <div key={i} className="rounded-lg border border-line bg-paper p-3.5">
                          <h4 className="text-xs font-semibold text-ink">{obs.area}</h4>
                          <p className="text-xs text-ink-2 mt-1">{obs.finding}</p>
                          {obs.evidence && <p className="text-[11px] text-ink-3 italic mt-1">“{obs.evidence}”</p>}
                          <p className="text-[11px] text-ink-3 mt-1.5">{obs.caveat}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisData.reflectionQuestions?.length > 0 && (
                    <div className="rounded-lg border border-line bg-paper p-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2 mb-2">Prompt Inquiries for Reflection</h3>
                      <ul className="space-y-1.5 text-xs text-ink-2 list-disc pl-4">
                        {analysisData.reflectionQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-[11px] text-ink-3 border-t border-line pt-3">{analysisData.disclaimer}</p>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowAnalysis(false)} className={btnGhost}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmDelete kind={draft.kind} onCancel={() => setConfirmDelete(false)} onConfirm={() => {
          if (timer.current) clearTimeout(timer.current);
          timer.current = null;
          if (draft.kind === "journal") store.deleteJournal(draft.id);
          else store.deleteNote(draft.id);
          router.push(draft.kind === "journal" ? "/writing?view=journals" : "/writing?view=notes");
        }} />
      )}
    </div>
  );
}

function SaveStatus({ status, savedAt }: { status: Status; savedAt: number | null }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((x) => x + 1), 20_000);
    return () => clearInterval(t);
  }, []);
  const ago = savedAt ? Math.round((Date.now() - savedAt) / 60_000) : 0;
  const text =
    status === "saving" ? "Saving…"
    : status === "dirty" ? "Unsaved changes"
    : status === "invalid" ? "Add a date to save"
    : status === "error" ? "Save failed — try again"
    : status === "saved" ? (ago < 1 ? "Saved just now" : `Saved ${ago} min ago`)
    : "";
  return (
    <span role="status" aria-live="polite" className={`text-xs transition-opacity ${status === "invalid" || status === "error" ? "text-clay" : "text-ink-3"} ${text ? "opacity-100" : "opacity-0"}`}>
      {text}
    </span>
  );
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [v, setV] = useState("");
  function add() {
    const t = v.trim().replace(/^#/, "").slice(0, 40);
    if (t && !tags.some((x) => x.toLowerCase() === t.toLowerCase()) && tags.length < 20) onChange([...tags, t]);
    setV("");
  }
  return (
    <div className="mt-4 flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-line py-0.5 pl-2.5 pr-1 text-xs text-ink-2">
          #{t}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove tag ${t}`}
            className="grid h-5 w-5 place-items-center rounded-full hover:bg-paper-2"><X className="h-3 w-3" /></button>
        </span>
      ))}
      <label htmlFor="tag-in" className="sr-only">Add tag</label>
      <input id="tag-in" value={v} onChange={(e) => setV(e.target.value)} onBlur={add}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          if (e.key === "Backspace" && !v && tags.length) onChange(tags.slice(0, -1));
        }}
        placeholder={tags.length ? "Add tag" : "Add tags…"}
        className="min-w-24 flex-1 bg-transparent py-1 text-xs text-ink outline-none placeholder:text-ink-3" />
    </div>
  );
}

function ConfirmDelete({ kind, onCancel, onConfirm }: { kind: string; onCancel: () => void; onConfirm: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/30" onClick={onCancel} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="del-h" aria-describedby="del-d"
        className="rise relative w-full max-w-sm rounded-lg border border-line bg-card p-6 shadow-soft">
        <h2 id="del-h" className="font-display text-xl text-ink">Delete this {kind} permanently?</h2>
        <p id="del-d" className="mt-2 text-sm leading-relaxed text-ink-2">
          This can’t be undone. If you only want it out of the way, archive it instead.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
          <button type="button" onClick={onConfirm} className="inline-flex items-center gap-2 rounded-full bg-clay px-4 py-2.5 text-sm font-medium text-paper hover:opacity-90">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
