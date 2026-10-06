"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Archive, ArchiveRestore, ArrowLeft, Bookmark, Star, Trash2, X } from "lucide-react";
import { formatLong, isValidISODate } from "@/lib/dates";
import { useStore } from "@/lib/store";
import { MOODS, type Journal, type Mood, type Note } from "@/lib/types";
import { RichEditor } from "./rich-editor";
import { Empty, Skeleton, btnGhost, btnPrimary } from "./ui";

type Draft = Journal | Note;
type Status = "idle" | "dirty" | "saving" | "saved" | "invalid" | "error";

const MAX_TITLE = 200;
const MAX_CONTENT = 500_000;

export function EntryEditor({ kind, id, presetDate }: { kind: "journal" | "note"; id: string; presetDate: string | null }) {
  const store = useStore();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [missing, setMissing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const draftRef = useRef<Draft | null>(null);
  const persisted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialise the draft once the store is ready.
  useEffect(() => {
    if (!store.ready || draftRef.current) return;
    const stamp = new Date().toISOString().slice(0, 19);
    let d: Draft | undefined;
    if (id === "new") {
      const base = { id: store.newId(kind === "journal" ? "j" : "n"), title: "", content: "", notebookId: null, tags: [], favorite: false, archived: false, createdAt: stamp, updatedAt: stamp };
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8 lg:py-10">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <Link href={isJournal ? "/writing?view=journals" : "/writing?view=notes"} className="-ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm text-ink-3 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> {isJournal ? "Journals" : "Notes"}
        </Link>
        <SaveStatus status={status} savedAt={savedAt} />
        <div className="ml-auto flex items-center gap-0.5">
          {isJournal && persisted.current && (
            <button type="button" onClick={() => store.toggleSavedMemory(draft.id)} aria-pressed={saved}
              title={saved ? "Remove from saved memories" : "Save to Memory Vault"} aria-label={saved ? "Remove from saved memories" : "Save to Memory Vault"}
              className="grid h-10 w-10 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
              <Bookmark className={`h-4 w-4 ${saved ? "fill-accent text-accent" : ""}`} />
            </button>
          )}
          <button type="button" onClick={() => update({ favorite: !draft.favorite }, true)} aria-pressed={draft.favorite}
            aria-label={draft.favorite ? "Remove from favorites" : "Add to favorites"} title="Favorite"
            className="grid h-10 w-10 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
            <Star className={`h-4 w-4 ${draft.favorite ? "fill-amber text-amber" : ""}`} />
          </button>
          <button type="button" onClick={() => update({ archived: !draft.archived }, true)}
            aria-label={draft.archived ? "Restore from archive" : "Archive"} title={draft.archived ? "Restore" : "Archive"}
            className="grid h-10 w-10 place-items-center rounded-md text-ink-3 hover:bg-paper-2 hover:text-ink">
            {draft.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </button>
          {persisted.current && (
            <button type="button" onClick={() => setConfirmDelete(true)} aria-label="Delete" title="Delete"
              className="grid h-10 w-10 place-items-center rounded-md text-ink-3 hover:bg-clay-soft hover:text-clay">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {draft.archived && (
        <p className="mt-3 rounded-md bg-paper-2 px-3 py-2 text-sm text-ink-2">
          This {draft.kind} is archived. It’s hidden from your main lists but nothing is lost.
        </p>
      )}

      {/* Metadata */}
      <div className="mt-6">
        {isJournal && (
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-ink-3">{dateInvalid ? "Journal" : formatLong(draft.journalDate)}</p>
        )}
        <label htmlFor="entry-title" className="sr-only">Title</label>
        <input id="entry-title" value={draft.title} maxLength={MAX_TITLE} onChange={(e) => update({ title: e.target.value })}
          placeholder={isJournal ? "Give this day a title" : "Untitled note"}
          className="w-full bg-transparent font-display text-3xl leading-tight text-ink outline-none placeholder:text-ink-3/70 sm:text-4xl" />
      </div>

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

        <div>
          <label htmlFor="e-nb" className="block text-xs text-ink-3">Notebook</label>
          <select id="e-nb" value={draft.notebookId ?? ""} onChange={(e) => update({ notebookId: e.target.value || null }, true)}
            className="mt-1 rounded-md border border-line bg-card px-2.5 py-1.5 text-ink outline-none focus:border-accent">
            <option value="">None</option>
            {store.notebooks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>

        {!isJournal && draft.deadline && (
          <label className="mt-5 flex items-center gap-2 text-ink-2">
            <input type="checkbox" checked={draft.completed} onChange={(e) => update({ completed: e.target.checked }, true)}
              className="h-4 w-4 accent-[var(--accent)]" />
            Completed
          </label>
        )}
      </div>

      <TagInput tags={draft.tags} onChange={(tags) => update({ tags }, true)} />

      <div className="mt-6">
        <RichEditor
          key={draft.id}
          initial={draft.content}
          placeholder={isJournal ? "What happened today? What is on your mind?" : "Capture an idea, task, reminder, or thought."}
          onChange={(html) => update({ content: html })}
        />
      </div>

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
