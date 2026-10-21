// Domain types aligned with the persisted user-owned records (see PLAN.md).

export type Mood = "calm" | "happy" | "grateful" | "proud" | "tired" | "anxious" | "sad" | "reflective" | "energetic" | "creative";

export const MOODS: { value: Mood; label: string; glyph: string }[] = [
  { value: "calm", label: "Calm", glyph: "◡" },
  { value: "happy", label: "Happy", glyph: "☼" },
  { value: "grateful", label: "Grateful", glyph: "❀" },
  { value: "proud", label: "Proud", glyph: "✦" },
  { value: "reflective", label: "Reflective", glyph: "◐" },
  { value: "energetic", label: "Energetic", glyph: "⚡" },
  { value: "creative", label: "Creative", glyph: "✎" },
  { value: "tired", label: "Tired", glyph: "☾" },
  { value: "anxious", label: "Anxious", glyph: "≈" },
  { value: "sad", label: "Sad", glyph: "◌" },
];

export type PaperStyle = "plain" | "ruled" | "grid" | "parchment" | "slate" | "sepia";
export type FontTheme = "serif" | "sans" | "mono" | "handwriting";
export type AccentColor = "default" | "amber" | "emerald" | "violet" | "rose" | "sky";

export interface Notebook {
  id: string;
  name: string;
  color?: string;
  description?: string;
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
  paperStyle?: PaperStyle;
  fontTheme?: FontTheme;
  accentColor?: AccentColor;
  drawingData?: string | null;
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
