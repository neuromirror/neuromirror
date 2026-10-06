export function htmlToText(html: string): string {
  return html
    .replace(/<\/(p|h[1-6]|li|blockquote|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function wordCount(text: string): number {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 220));

export function excerpt(html: string, len = 160): string {
  const t = htmlToText(html).replace(/\s+/g, " ");
  return t.length > len ? t.slice(0, len).replace(/\s+\S*$/, "") + "…" : t;
}
