"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toISODate } from "./dates";
import { createClient } from "./supabase/client";
import type { Journal, Note, Notebook } from "./types";

interface Store {
  ready: boolean;
  today: string;
  now: Date;
  journals: Journal[];
  notes: Note[];
  notebooks: Notebook[];
  saveJournal: (j: Journal) => Promise<void>;
  saveNote: (n: Note) => Promise<void>;
  deleteJournal: (id: string) => void;
  deleteNote: (id: string) => void;
  toggleSavedMemory: (journalId: string) => void;
  savedMemoryIds: string[];
  newId: (prefix: string) => string;
}

const Ctx = createContext<Store | null>(null);
const stamp = () => new Date().toISOString();

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [savedMemoryIds, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const client = createClient();
    let active = true;
    void (async () => {
      const [j, n, b, s] = await Promise.all([
        client.from("journals").select("*").order("journal_date", { ascending: false }),
        client.from("notes").select("*").order("updated_at", { ascending: false }),
        client.from("notebooks").select("id,name").order("name"),
        client.from("saved_memories").select("journal_id"),
      ]);
      if (!active) return;
      if (j.error || n.error || b.error || s.error) console.error("Could not load your NeuroMirror records.");
      setJournals((j.data ?? []).map((x: any) => ({ kind: "journal", id: x.id, title: x.title, content: x.content, journalDate: x.journal_date, mood: x.mood, notebookId: x.notebook_id, tags: x.tags ?? [], favorite: x.favorite, archived: x.archived, createdAt: x.created_at, updatedAt: x.updated_at })));
      setNotes((n.data ?? []).map((x: any) => ({ kind: "note", id: x.id, title: x.title, content: x.content, deadline: x.deadline, completed: x.completed, notebookId: x.notebook_id, tags: x.tags ?? [], favorite: x.favorite, archived: x.archived, createdAt: x.created_at, updatedAt: x.updated_at })));
      setNotebooks((b.data ?? []).map((x: any) => ({ id: x.id, name: x.name })));
      setSaved((s.data ?? []).map((x: any) => x.journal_id));
      setNow(new Date());
    })();
    return () => { active = false; };
  }, []);

  const saveJournal = useCallback(async (j: Journal) => {
    const next = { ...j, updatedAt: stamp() };
    setJournals(all => all.some(x => x.id === j.id) ? all.map(x => x.id === j.id ? next : x) : [next, ...all]);
    const { error } = await createClient().from("journals").upsert({ id: j.id, title: j.title, content: j.content, journal_date: j.journalDate, mood: j.mood, notebook_id: j.notebookId, tags: j.tags, favorite: j.favorite, archived: j.archived, created_at: j.createdAt, updated_at: next.updatedAt });
    if (error) throw new Error("Could not save this journal. Check your connection and try again.");
  }, []);

  const saveNote = useCallback(async (n: Note) => {
    const next = { ...n, updatedAt: stamp() };
    setNotes(all => all.some(x => x.id === n.id) ? all.map(x => x.id === n.id ? next : x) : [next, ...all]);
    const { error } = await createClient().from("notes").upsert({ id: n.id, title: n.title, content: n.content, deadline: n.deadline, completed: n.completed, notebook_id: n.notebookId, tags: n.tags, favorite: n.favorite, archived: n.archived, created_at: n.createdAt, updated_at: next.updatedAt });
    if (error) throw new Error("Could not save this note. Check your connection and try again.");
  }, []);

  const deleteJournal = useCallback((id: string) => {
    setJournals(all => all.filter(x => x.id !== id)); setSaved(all => all.filter(x => x !== id));
    void createClient().from("journals").delete().eq("id", id).then(({ error }) => { if (error) console.error("Journal delete failed."); });
  }, []);
  const deleteNote = useCallback((id: string) => {
    setNotes(all => all.filter(x => x.id !== id));
    void createClient().from("notes").delete().eq("id", id).then(({ error }) => { if (error) console.error("Note delete failed."); });
  }, []);
  const toggleSavedMemory = useCallback((id: string) => {
    setSaved(all => {
      const exists = all.includes(id);
      const client = createClient();
      if (exists) void client.from("saved_memories").delete().eq("journal_id", id);
      else void client.from("saved_memories").insert({ journal_id: id });
      return exists ? all.filter(x => x !== id) : [id, ...all];
    });
  }, []);

  const value = useMemo<Store>(() => ({ ready: now !== null, now: now ?? new Date(0), today: now ? toISODate(now) : "", journals, notes, notebooks, saveJournal, saveNote, deleteJournal, deleteNote, toggleSavedMemory, savedMemoryIds, newId: () => crypto.randomUUID() }), [now, journals, notes, notebooks, saveJournal, saveNote, deleteJournal, deleteNote, toggleSavedMemory, savedMemoryIds]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() { const s = useContext(Ctx); if (!s) throw new Error("useStore must be used inside StoreProvider"); return s; }
