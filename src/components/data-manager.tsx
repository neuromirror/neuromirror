"use client";

import { useState } from "react";
import { Download, Trash2, FileText, AlertTriangle, CheckCircle, Database } from "lucide-react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export function DataManager() {
  const { journals, notes, notebooks } = useStore();
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 1. Export as JSON
  const handleExportJSON = () => {
    try {
      setBusy(true);
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        journals: journals.map((j) => ({
          id: j.id,
          journalDate: j.journalDate,
          title: j.title,
          content: j.content,
          mood: j.mood,
          notebookId: j.notebookId,
          tags: j.tags,
          favorite: j.favorite,
          updatedAt: j.updatedAt,
        })),
        notes: notes.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          tags: n.tags,
          favorite: n.favorite,
          updatedAt: n.updatedAt,
        })),
        notebooks: notebooks.map((nb) => ({
          id: nb.id,
          name: nb.name,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neuromirror-archive-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMsg("Your complete journal archive was exported successfully to JSON.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("Failed to export data. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // 2. Export as Markdown (.md)
  const handleExportMarkdown = () => {
    try {
      setBusy(true);
      let mdContent = `# NeuroMirror Personal Archive\nExported on: ${new Date().toLocaleDateString()}\n\n---\n\n`;

      journals.forEach((j) => {
        const plainText = j.content
          .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n\n")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .trim();

        mdContent += `## ${j.journalDate} · ${j.title || "Untitled Journal"}\n`;
        if (j.mood) mdContent += `**Mood:** ${j.mood}  \n`;
        if (j.tags?.length) mdContent += `**Tags:** ${j.tags.join(", ")}  \n`;
        mdContent += `\n${plainText}\n\n---\n\n`;
      });

      const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neuromirror-journals-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMsg("Your journals were exported successfully as readable Markdown.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("Failed to export Markdown. Please retry.");
    } finally {
      setBusy(false);
    }
  };

  // 3. Self-Service Clear All Data
  const handleDeleteAllData = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setBusy(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to delete data.");
      }

      // Delete all records belonging to this user
      await supabase.from("cognitive_insights").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("journals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("notes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("notebooks").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      setConfirmDelete(false);
      setSuccessMsg("All your entries, notes, and insights have been permanently deleted.");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not delete data.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="data-mgmt-h" className="mt-6 rounded-lg border border-line bg-card p-6">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-accent" />
        <h2 id="data-mgmt-h" className="font-display text-xl text-ink">
          Data Sovereignty & Portability
        </h2>
      </div>
      <p className="mt-2 text-sm text-ink-2 leading-relaxed">
        You retain full ownership of everything you write. Download your complete historical archive
        at any time in open formats (JSON or Markdown) with zero lock-in.
      </p>

      {successMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-accent/10 p-3 text-sm text-accent">
          <CheckCircle className="h-4 w-4 shrink-0" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-clay/10 p-3 text-sm text-clay">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {errorMsg}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={handleExportJSON}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-xs font-medium text-ink hover:bg-paper-2 disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> Export All Data (JSON)
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={handleExportMarkdown}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-xs font-medium text-ink hover:bg-paper-2 disabled:opacity-50"
        >
          <FileText className="h-3.5 w-3.5" /> Export Journals (Markdown .md)
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={handleDeleteAllData}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition ${
            confirmDelete
              ? "bg-clay text-white animate-pulse"
              : "border border-clay/30 text-clay hover:bg-clay/10"
          } disabled:opacity-50`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {confirmDelete ? "Click again to confirm permanent deletion" : "Erase All My Data"}
        </button>
      </div>

      <p className="mt-4 text-xs text-ink-3">
        Total saved records: {journals.length} journals, {notes.length} notes, {notebooks.length}{" "}
        notebooks.
      </p>
    </section>
  );
}
