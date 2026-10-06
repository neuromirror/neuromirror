"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { TableKit } from "@tiptap/extension-table";
import ImageExt from "@tiptap/extension-image";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Highlighter, Image as ImageIcon, Italic, Link as LinkIcon,
  List, ListChecks, ListOrdered, Pilcrow, Quote, Redo2, RemoveFormatting, Strikethrough, Table, Underline, Undo2,
} from "lucide-react";
import { readingMinutes } from "@/lib/text";

export interface EditorStats {
  words: number;
  characters: number;
}

/**
 * Rich-text editor. Content is parsed through the Tiptap schema, so any HTML
 * that is not an allowed node/mark (scripts, event handlers, iframes…) is
 * dropped. Links reject non-http(s)/mailto protocols.
 */
export function RichEditor({
  initial,
  placeholder,
  onChange,
}: {
  initial: string;
  placeholder: string;
  onChange: (html: string, stats: EditorStats) => void;
}) {
  const [stats, setStats] = useState<EditorStats>({ words: 0, characters: 0 });

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https", "mailto"],
          isAllowedUri: (url) => /^(https?:|mailto:)/i.test(url) || !/^[a-z][a-z0-9+.-]*:/i.test(url),
        },
      }),
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit.configure({ table: { resizable: false } }),
      ImageExt.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: initial,
    editorProps: {
      attributes: { class: "prose-journal", "aria-label": "Entry text", role: "textbox", "aria-multiline": "true" },
    },
    onCreate: ({ editor }) => setStats(count(editor)),
    onUpdate: ({ editor }) => {
      const s = count(editor);
      setStats(s);
      onChange(editor.getHTML(), s);
    },
  });

  return (
    <div>
      {editor && <Toolbar editor={editor} />}
      <div className="mt-6">
        <EditorContent editor={editor} />
      </div>
      <p className="mt-10 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 text-xs text-ink-3" aria-live="off">
        <span>{stats.words.toLocaleString()} words</span>
        <span>{stats.characters.toLocaleString()} characters</span>
        <span>{readingMinutes(stats.words)} min read</span>
      </p>
    </div>
  );
}

function count(editor: Editor): EditorStats {
  const s = editor.storage.characterCount;
  return { words: s.words(), characters: s.characters() };
}

function Btn({ label, active, disabled, onClick, children }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors disabled:opacity-30 ${
        active ? "bg-paper-2 text-accent" : "text-ink-2 hover:bg-paper-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px shrink-0 bg-line" aria-hidden />;

function Toolbar({ editor }: { editor: Editor }) {
  const [prompt, setPrompt] = useState<null | "link" | "image">(null);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const c = () => editor.chain().focus();
  const ic = "h-4 w-4";

  function openPrompt(kind: "link" | "image") {
    setErr(null);
    setUrl(kind === "link" ? (editor.getAttributes("link").href ?? "") : "");
    setPrompt(kind);
  }

  function applyPrompt(e: React.FormEvent) {
    e.preventDefault();
    const v = url.trim();
    if (prompt === "link") {
      if (!v) c().extendMarkRange("link").unsetLink().run();
      else if (!/^(https?:\/\/|mailto:)/i.test(v) && /^[a-z][a-z0-9+.-]*:/i.test(v)) return setErr("Only web and email links are allowed.");
      else c().extendMarkRange("link").setLink({ href: /^(https?:|mailto:)/i.test(v) ? v : `https://${v}` }).run();
    } else if (prompt === "image") {
      if (!/^https:\/\/\S+$/i.test(v)) return setErr("Use an https:// image address.");
      c().setImage({ src: v, alt: "" }).run();
    }
    setPrompt(null);
  }

  const inTable = editor.isActive("table");

  return (
    <div className="sticky top-[57px] z-10 -mx-2 border-y border-line bg-paper/95 backdrop-blur lg:top-0">
      <div role="toolbar" aria-label="Formatting" className="flex items-center overflow-x-auto px-1 py-1 [scrollbar-width:none]">
        <Btn label="Undo" disabled={!editor.can().undo()} onClick={() => c().undo().run()}><Undo2 className={ic} /></Btn>
        <Btn label="Redo" disabled={!editor.can().redo()} onClick={() => c().redo().run()}><Redo2 className={ic} /></Btn>
        <Sep />
        <Btn label="Paragraph" active={editor.isActive("paragraph")} onClick={() => c().setParagraph().run()}><Pilcrow className={ic} /></Btn>
        <Btn label="Heading" active={editor.isActive("heading", { level: 1 })} onClick={() => c().toggleHeading({ level: 1 }).run()}><Heading1 className={ic} /></Btn>
        <Btn label="Subheading" active={editor.isActive("heading", { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className={ic} /></Btn>
        <Sep />
        <Btn label="Bold" active={editor.isActive("bold")} onClick={() => c().toggleBold().run()}><Bold className={ic} /></Btn>
        <Btn label="Italic" active={editor.isActive("italic")} onClick={() => c().toggleItalic().run()}><Italic className={ic} /></Btn>
        <Btn label="Underline" active={editor.isActive("underline")} onClick={() => c().toggleUnderline().run()}><Underline className={ic} /></Btn>
        <Btn label="Strikethrough" active={editor.isActive("strike")} onClick={() => c().toggleStrike().run()}><Strikethrough className={ic} /></Btn>
        <Btn label="Highlight" active={editor.isActive("highlight")} onClick={() => c().toggleHighlight().run()}><Highlighter className={ic} /></Btn>
        <Btn label="Link" active={editor.isActive("link")} onClick={() => openPrompt("link")}><LinkIcon className={ic} /></Btn>
        <Sep />
        <Btn label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => c().toggleBulletList().run()}><List className={ic} /></Btn>
        <Btn label="Numbered list" active={editor.isActive("orderedList")} onClick={() => c().toggleOrderedList().run()}><ListOrdered className={ic} /></Btn>
        <Btn label="Checklist" active={editor.isActive("taskList")} onClick={() => c().toggleTaskList().run()}><ListChecks className={ic} /></Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")} onClick={() => c().toggleBlockquote().run()}><Quote className={ic} /></Btn>
        <Sep />
        <Btn label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => c().setTextAlign("left").run()}><AlignLeft className={ic} /></Btn>
        <Btn label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => c().setTextAlign("center").run()}><AlignCenter className={ic} /></Btn>
        <Btn label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => c().setTextAlign("right").run()}><AlignRight className={ic} /></Btn>
        <Sep />
        <Btn label="Insert table" active={inTable} onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table className={ic} /></Btn>
        <Btn label="Insert image from link" onClick={() => openPrompt("image")}><ImageIcon className={ic} /></Btn>
        <Btn label="Clear formatting" onClick={() => c().unsetAllMarks().clearNodes().run()}><RemoveFormatting className={ic} /></Btn>
      </div>

      {inTable && (
        <div className="flex flex-wrap gap-1 border-t border-line px-2 py-1.5 text-xs">
          {([
            ["Add row", () => c().addRowAfter().run()],
            ["Add column", () => c().addColumnAfter().run()],
            ["Delete row", () => c().deleteRow().run()],
            ["Delete column", () => c().deleteColumn().run()],
            ["Delete table", () => c().deleteTable().run()],
          ] as const).map(([l, fn]) => (
            <button key={l} type="button" onMouseDown={(e) => e.preventDefault()} onClick={fn}
              className="rounded-md px-2.5 py-1.5 text-ink-2 hover:bg-paper-2 hover:text-ink">{l}</button>
          ))}
        </div>
      )}

      {prompt && (
        <form onSubmit={applyPrompt} className="flex flex-wrap items-center gap-2 border-t border-line px-2 py-2">
          <label htmlFor="tb-url" className="text-xs text-ink-3">{prompt === "link" ? "Link address" : "Image address"}</label>
          <input id="tb-url" autoFocus value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setPrompt(null)}
            placeholder={prompt === "link" ? "https://… (leave empty to remove)" : "https://…/photo.jpg"}
            aria-invalid={!!err} aria-describedby={err ? "tb-err" : undefined}
            className="min-w-0 flex-1 rounded-md border border-line-2 bg-card px-3 py-1.5 text-sm text-ink outline-none focus:border-accent" />
          <button type="submit" className="rounded-md bg-ink px-3 py-1.5 text-xs text-paper">Apply</button>
          <button type="button" onClick={() => setPrompt(null)} className="rounded-md px-2 py-1.5 text-xs text-ink-3 hover:text-ink">Cancel</button>
          {err && <p id="tb-err" role="alert" className="w-full text-xs text-clay">{err}</p>}
        </form>
      )}
    </div>
  );
}
