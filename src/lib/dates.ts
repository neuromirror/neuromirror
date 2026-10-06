// All "day" values are local-calendar YYYY-MM-DD strings to avoid timezone drift.

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number): string {
  const d = fromISODate(s);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((fromISODate(to).getTime() - fromISODate(from).getTime()) / 86_400_000);
}

export const isValidISODate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && toISODate(fromISODate(s)) === s;

export function formatLong(s: string): string {
  return fromISODate(s).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function formatMedium(s: string): string {
  return fromISODate(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatShort(s: string): string {
  return fromISODate(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type Urgency = "overdue" | "today" | "soon" | "upcoming" | "later";

/** Deadline urgency: >7 days later, 3–7 upcoming, 1–2 soon, 0 today, <0 overdue. */
export function deadlineInfo(deadline: string, today: string): { urgency: Urgency; days: number; label: string } {
  const days = daysBetween(today, deadline);
  if (days < 0) return { urgency: "overdue", days, label: `Overdue by ${-days} day${days === -1 ? "" : "s"}` };
  if (days === 0) return { urgency: "today", days, label: "Due today" };
  if (days === 1) return { urgency: "soon", days, label: "Due tomorrow" };
  if (days === 2) return { urgency: "soon", days, label: "Due in 2 days" };
  return { urgency: days <= 7 ? "upcoming" : "later", days, label: `Due in ${days} days` };
}

export function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 5) return "Still awake";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
