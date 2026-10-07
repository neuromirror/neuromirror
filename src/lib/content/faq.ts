// Single source for the public FAQ: rendered as visible HTML on the landing
// page AND emitted as FAQPage structured data, so the two never diverge.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What is NeuroMirror?",
    a: "NeuroMirror is a private journal for cognitive health reflection through writing. You can request non-diagnostic observations about your own writing over time, alongside dated journals, notes, Memory Vault search, notebooks, and games.",
  },
  {
    q: "Is NeuroMirror a diary?",
    a: "It can be used as one, but it is more than a diary. NeuroMirror combines journaling, notes with optional deadlines, memory organization, a journal calendar, and optional AI-assisted reflection in one place.",
  },
  {
    q: "What is a digital journal?",
    a: "A digital journal is a journal you keep on a computer or phone instead of paper. Entries can be searched and organized in your account, which makes it easier to revisit what you wrote later.",
  },
  {
    q: "Is NeuroMirror a medical diagnostic tool?",
    a: "No. NeuroMirror does not diagnose, treat, or predict any medical condition. Cognitive-language insights are informational observations about writing patterns and must not replace evaluation by a qualified healthcare professional.",
  },
  {
    q: "Does NeuroMirror diagnose dementia?",
    a: "No. NeuroMirror does not diagnose dementia or any other condition, and it never shows a medical probability. Some people use it to keep an organized record of their writing over time, which they may choose to discuss with a professional.",
  },
  {
    q: "Can I use NeuroMirror just for normal journaling?",
    a: "Yes. Every AI and cognitive-awareness feature is optional. Many people simply use NeuroMirror as a calm place to write and keep their memories organized.",
  },
  {
    q: "Do I need to write every day?",
    a: "No. Write whenever you like. NeuroMirror shows a gentle writing streak, but there is no pressure and nothing is lost if you take a break.",
  },
  {
    q: "Can I create notes without a journal date?",
    a: "Yes. Journals always have a date, which places them on your calendar. Notes do not need a date at all. A note can optionally have a deadline, which is shown on your Home page and is separate from journal dates.",
  },
  {
    q: "Is my writing private?",
    a: "Your journals and notes are private to your account. They are protected with authenticated access and database-level security rules that only allow your account to read or change your records. No system can promise absolute security, so we describe the protections we actually use.",
  },
  {
    q: "Can other users see my journals or notes?",
    a: "No. Your private journals and notes belong to your account and are protected from other users. There are no public journal pages, and private pages are excluded from search engines.",
  },
  {
    q: "Can I access my writing later?",
    a: "Yes. Saved journals and notes are stored in your account and are available whenever you sign in again, on any device.",
  },
  {
    q: "Can I search old journals?",
    a: "Yes. Normal search finds titles, tags, and words. Memory Vault currently previews entries that match words in your query; meaning-based search for entries described in different words is not available yet.",
  },
  {
    q: "What is Memory Vault?",
    a: "Memory Vault is NeuroMirror’s memory organization space. It includes a keyword-based search preview, filters, a memory timeline, On This Day, and saved memories. Search results link to real entries you wrote, with the real date and an excerpt taken from your text. Meaning-based search is not available yet.",
  },
  {
    q: "Does NeuroMirror analyze my writing?",
    a: "Only when you ask for an analysis. It describes patterns in the selected entry and compares them with up to five previous analysis summaries from your account. It does not score or diagnose cognitive health. Autosave never sends your writing to AI.",
  },
  {
    q: "How does NeuroMirror use AI with my journal text?",
    a: "When you request a cognitive-language analysis, the selected journal and up to five earlier analysis summaries from your account are sent to Gemini. Other journal entries are not sent. Memory Vault search stays within your account and does not use Gemini. Your password and account tokens are never sent.",
  },
  {
    q: "Is voice analysis available?",
    a: "Not yet. Voice analysis is coming soon. NeuroMirror currently works with written entries only.",
  },
  {
    q: "Do I need to verify my email?",
    a: "No. In the current version you can create an account with an email and password and start writing immediately.",
  },
  {
    q: "Does NeuroMirror support dark mode?",
    a: "Yes. NeuroMirror has a warm light theme, a charcoal dark theme, and a System option that follows your device.",
  },
  {
    q: "Can I delete my data?",
    a: "You can delete individual journals and notes in the app. Account-wide deletion is not currently available in Settings; contact the site owner to request account removal. Data export is not currently available.",
  },
  {
    q: "Is NeuroMirror free?",
    a: "Yes. NeuroMirror is currently free to use. It may in future be supported by clearly separated, non-intrusive ads that never appear inside your writing. There is no subscription or paywall.",
  },
];

