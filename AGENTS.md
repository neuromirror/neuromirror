# AGENTS.md

Guidance for AI agents working on NeuroMirror. **Start with [PLAN.md](./PLAN.md).** Milestone 1 (the product surface) is
done, so continue from the next unchecked milestone.

## Architecture

- `src/app/page.tsx`: public landing page, server-rendered. All important copy is plain HTML for SEO, AEO, and GEO. JSON-LD is emitted here.
- `src/app/(auth)/*`: sign-in, sign-up, and forgot-password screens (UI only for now; see `components/auth-form.tsx`).
- `src/app/(app)/*`: the private app. `layout.tsx` sets noindex metadata and wraps pages in `StoreProvider` and `AppShell`.
  - `home`, `writing` (library), `writing/journal/[id]` and `writing/note/[id]` (the editor; `new` is a reserved id), `calendar`, `memory-vault`, `insights`, `games`, `reports`, `settings`.
- `src/lib/store.tsx`: client store and hook (`useStore`), backed by the signed-in user's Supabase rows.
- `src/lib/supabase/*`: browser/server Supabase clients; `src/middleware.ts` refreshes Auth cookies.
- `src/lib/types.ts`: domain types that mirror the planned tables.
- `src/lib/dates.ts`: local `YYYY-MM-DD` day helpers and deadline urgency.
- `src/lib/keyword-search.ts`: Memory Vault retrieval stage, which later becomes the candidate step before Gemini ranking.
- `src/lib/content/faq.ts`: the single FAQ source, used for both the visible FAQ and the FAQPage schema.
- `src/components/rich-editor.tsx`: Tiptap editor and toolbar. `entry-editor.tsx`: journal/note screen with autosave.
- `next.config.ts`: security headers (CSP and others) and `X-Robots-Tag: noindex` for private routes.

## Product rules (do not break)

- A journal **always** has a `journalDate`, and that date alone places it on the Calendar.
- A note never needs a date. Its optional `deadline` is separate, never appears on the Calendar, and feeds only the Home deadline counter.
- Memory Vault is a single feature (search, filters, saved memories, timeline, On This Day). Don't add a separate "Memory Search" nav item.
- Never fabricate AI output, excerpts, dates, or memories. Excerpts must be verbatim from the entry.
- Cognitive content is always informational and non-diagnostic. Voice analysis stays "Coming Soon" until a real backend exists.
- Never seed fixture journals, notes, saved memories, or notebooks. Empty accounts start empty.
- Gemini calls happen only on explicit user action, on the server, using only the selected user's own journal.
- No placeholder buttons that don't do anything. Unbuilt sections use `components/upcoming.tsx`, which is honest about their state.
- Autosave never calls AI.

## Conventions

- Theme colors come only from the CSS variables in `globals.css` (Tailwind tokens: `paper`, `card`, `ink`, `ink-2`, `ink-3`, `line`, `accent`, `clay`, `amber`, and others). Don't hard-code colors, so both themes keep working.
- Fonts: `font-display` (Fraunces) for headings, `font-serif` (Newsreader) for writing, `font-sans` (Instrument Sans) for UI.
- Date-dependent UI renders client-side after the store is ready, to avoid SSR/hydration drift. Show a skeleton until then.
- Next 15: `params` and `searchParams` are Promises. Server page wrappers await them and pass them to client components.
- Keep restrained motion (`.rise`) and respect `prefers-reduced-motion` (handled globally).
