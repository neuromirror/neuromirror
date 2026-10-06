# NeuroMirror — Product Roadmap

NeuroMirror is a private digital journal, personal memory archive, and optional cognitive-awareness companion.
The roadmap is split into self-contained milestones. Each one leaves the product shippable.

---

## ✅ Milestone 1 — Product surface (done)

The product surface is connected to per-user Supabase accounts and persistence. New accounts begin empty.

- Public landing page with Hero, About, How It Works, Memory Vault explainer, Who It's For, Privacy, What We Don't Claim, and FAQ.
- SEO, AEO, and GEO: title and description, canonical, Open Graph and Twitter metadata, `robots.txt`, `sitemap.xml`, web manifest, favicon, and Organization / WebSite / SoftwareApplication / FAQPage JSON-LD. The FAQ JSON-LD is generated from the same source as the visible FAQ.
- Private routes are marked noindex through page metadata and `X-Robots-Tag` headers. Security headers (CSP, HSTS, frame denial, and others) are set in `next.config.ts`.
- Light, dark, and system themes, persisted with a pre-paint script so the page never flashes the wrong theme.
- App shell: a desktop sidebar, a mobile bottom navigation with a "More" sheet, and the full navigation (Home, Writing, Calendar, Memory Vault, Insights, Cognitive Games, Reports, Settings).
- **Home**: greeting, quick actions, Memory Vault search card, live deadline counter (overdue, due today, this week), recent writing, activity stats, and writing streak.
- **Writing**: Journals, Notes, Favorites, Archive, Tags, and Notebooks, with filtering and pagination.
- **Editor** (Tiptap): headings, bold, italic, underline, strikethrough, highlight, links, bulleted and numbered lists, checklists, quotes, alignment, tables, images by URL, undo/redo, clear formatting, and word/character/reading-time counts. Autosave shows Unsaved changes, then Saving…, then Saved just now. Also included: Cmd/Ctrl+S, a warning before leaving with unsaved changes, and a delete confirmation dialog.
  - Journals **require** a date. Notes have an **optional** deadline and a completed flag. The two concepts are kept separate.
- **Calendar**: driven only by journal dates, with a keyboard-navigable month grid. Selecting a day lists that day's journals, and "Write a Journal" opens a new journal with the date preselected. Changing a journal's date moves it on the calendar.
- **Memory Vault** (preview): keyword retrieval with filters (date range, notebook, tag, mood, favorites) and sorting, verbatim excerpts, an honest "I couldn't find a matching memory" empty state, plus Saved memories, Timeline, and On This Day.
- Insights now provides user-requested Gemini language analysis and per-user analysis history. Cognitive Games includes playable Sequence Recall and Pattern Match activities with per-user score history. Reports and some account settings remain future work.

The client store loads and saves only the authenticated user's records through Supabase. No sample journal data is seeded.

---

## Milestone 2 — Accounts & real persistence

**Decision to confirm:** the original brief names Supabase (Auth + Postgres + RLS). The site already has a managed Postgres database available through Netlify Database, with Netlify Identity for email/password auth. Either option supports the required isolation model. The tasks below are written so either backend fits.

1. Email/password sign-up (no mandatory email verification), sign-in, sign-out, forgot/reset password, and session persistence.
2. Server-side route protection for every private route, applied before any content renders. Expired sessions redirect to sign-in.
3. Schema: `profiles`, `notebooks`, `journals` (with `journal_date NOT NULL`), `notes` (with nullable `deadline` and a `completed` flag), `tags`, `journal_tags`, `note_tags`, `saved_memories` (FK to journals, `ON DELETE CASCADE`), `cognitive_insights`, `game_results`, `reports`, and `user_preferences`. Every table has a `user_id`, and all deletes cascade from the user.
4. Indexes on `(user_id, journal_date)`, `(user_id, updated_at)`, `(user_id, deadline)`, and the tag join tables, plus a `tsvector` full-text index on journal title and content.
5. Row-level security on every user table: SELECT, INSERT, UPDATE, and DELETE all require `user_id = authenticated user`. Join tables check ownership of both sides. `user_id` is always derived from the session and never accepted from the client.
6. API routes for journals, notes, tags, notebooks, and saved memories. Each route checks the session, validates input (size limits, ISO dates, UUIDs), and returns only rows the caller owns.
7. Server-side HTML sanitization of rich text on write, in addition to the editor schema.
8. Replace `store.tsx` internals with API calls, keeping the hook surface. Add cursor pagination.
9. Cross-account tests (User A / User B) for URLs, APIs, search, and deadlines.

## Milestone 3 — Global search & organization polish

1. Global search across journals, notes, tags, notebooks, and saved memories, using the full-text index and scoped to the user.
2. Create, rename, and delete notebooks and tags. Default notebook setting.
3. Image and attachment uploads, with type and size validation and per-user private storage.
4. Recently opened entries, and keyboard shortcuts (new journal, search).

## Milestone 4 — Gemini: Memory Vault, reflection & writing assistant

All AI calls run server-side, either through `GEMINI_API_KEY` or the Netlify AI Gateway. None run on autosave.

1. **Memory Vault pipeline**: authenticate → apply filters → retrieve full-text candidates from the user's own journals (top 10–20) → send only those candidates to Gemini, with a system prompt that treats journal text as untrusted data → Gemini returns structured JSON (`journal_id`, `reason`, `excerpt`) → validate the schema, check each ID against the candidate set, and check each excerpt is a verbatim substring → display. If the AI call fails, fall back to the keyword results.
2. **Reflect on this**: sends only the selected journal. Returns themes, emotional themes, observations, questions, and a summary, phrased tentatively ("Your entry appears to focus on…").
3. **AI writing assistant**: improve, rewrite, summarize, continue, reflection questions, themes, and title. Results are shown as a preview with Accept/Discard and never overwrite text automatically.
4. Optional Home reflection based on recent entries.
5. Per-user rate limiting, timeouts, and friendly error states. Logs never contain journal text.
6. AI feature toggles in Settings, with a plain-language explanation of how AI uses text.

## Milestone 5 — Insights & trends

1. Writing insights computed in SQL: frequency, average length, tag usage, and mood trend.
2. Cognitive-language insights, generated only on request and stored in `cognitive_insights`: repetition, sentence complexity, coherence, recall language, and hesitation markers. Each comes with an explanation and the non-diagnostic disclaimer.
3. Trend charts only where they help, each with "what this measures" text. Voice analysis stays marked Coming Soon.

## Milestone 6 — Cognitive Games

Pattern Match, Sequence Recall, Memory Recall, Sentence Completion, and an attention task. Results are stored in `game_results`, difficulty adapts, and each game shows its own statistics.

## Milestone 7 — Reports, export & account control

1. Reports over a chosen period that clearly separate user data from AI observations and include disclaimers. Print/PDF export.
2. Data export (JSON) containing only the user's own records.
3. Account deletion with typed confirmation that cascades all personal data.
4. Remaining settings: profile, email, password, editor preferences, and notifications.

## Milestone 8 — Hardening & launch

CSP review against final providers, accessibility audit, Lighthouse/Core Web Vitals pass, privacy-friendly aggregate analytics (no journal text), optional non-intrusive ad slots kept away from writing, and the full security checklist from the brief.
