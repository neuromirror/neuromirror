// Domain types aligned with the persisted user-owned records (see PLAN.md).

export type Mood = "calm" | "happy" | "grateful" | "proud" | "tired" | "anxious" | "sad" | "reflective";

export const MOODS: { value: Mood; label: string; glyph: string }[] = [
  { value: "calm", label: "Calm", glyph: "◡" },
  { value: "happy", label: "Happy", glyph: "☼" },
  { value: "grateful", label: "Grateful", glyph: "❀" },
  { value: "proud", label: "Proud", glyph: "✦" },
  { value: "reflective", label: "Reflective", glyph: "◐" },
  { value: "tired", label: "Tired", glyph: "☾" },
  { value: "anxious", label: "Anxious", glyph: "≈" },
  { value: "sad", label: "Sad", glyph: "◌" },
];

export interface Notebook {
  id: string;
  name: string;
}

interface WritingBase {
  id: string;
  title: string;
  /** Rich text as HTML produced by the editor schema. */
  content: string;
  notebookId: string | null;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Journal extends WritingBase {
  kind: "journal";
  /** Required. YYYY-MM-DD in the user's local calendar. Determines calendar placement. */
  journalDate: string;
  mood: Mood | null;
}

export interface Note extends WritingBase {
  kind: "note";
  /** Optional. YYYY-MM-DD. A deadline is NOT a journal date and never places a note on the calendar. */
  deadline: string | null;
  completed: boolean;
}

export type Entry = Journal | Note;
