# NeuroMirror

NeuroMirror is a private journal built around cognitive-language awareness: people choose entries to analyze, build a history of writing patterns, and reflect on how their writing changes. The observations are informational and non-diagnostic. Journals, notes, analyses, and game results are scoped to the signed-in user with Supabase Auth and row-level security. Accounts begin empty; the example excerpt on the landing page is static display copy and is never stored.

## Run locally

1. Install Node.js 22 and pnpm 11.
2. Run `pnpm install --frozen-lockfile`.
3. Copy `.env.example` to `.env.local`. The supplied values point at the connected Supabase project; update them if you use another project.
4. Run `pnpm dev` and visit `http://localhost:3000`.

Supabase handles email/password and Google sign-in. Google sign-in requires OAuth credentials from your Google account; setup is below. Cognitive analysis and optional audio transcription run in authenticated Supabase Edge Functions and call Cloudflare Workers AI server-side.

## Supabase setup

This app is connected to Supabase project **neuromirror** (`wnymtskjnmuzuaqdrewc`). The database migrations are in `supabase/migrations/`; the initial schema and row-level security policies have been applied.

### Cognitive-language analysis

The authenticated `cognitive-analysis` Supabase Edge Function reads the selected journal and up to five earlier analysis summaries through the user's RLS-scoped session, sends only those materials to Cloudflare Workers AI, validates the structured response and exact-quote evidence, and saves the result to the user's account. Analysis runs only after an explicit request; autosave never invokes it. Configure `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and optionally `CLOUDFLARE_TEXT_MODEL` in Supabase Edge Function secrets. The default is `@cf/qwen/qwen3-30b-a3b-fp8`.

Voice journaling optionally sends a user-selected recording to the authenticated `voice-transcription` function, using `@cf/openai/whisper-large-v3-turbo` by default. Configure `CLOUDFLARE_STT_MODEL` to override it. Recordings are held temporarily in browser memory, are not persisted, and transcripts remain editable drafts until the user reviews and explicitly saves them as dated journal entries. Voice-quality, tone, emotion, and health analysis are unavailable.

Keep these Cloudflare AI secrets only in Supabase Edge Function secrets. They are separate from GitHub Actions secrets used to deploy the Cloudflare Worker website. Never add them to `.env.example`, `NEXT_PUBLIC_*` variables, source files, or the GitHub repository.

### Enable Google sign-in

1. In [Google Auth Platform](https://console.cloud.google.com/auth/clients), create a **Web application** OAuth client. Set your app URL (and `http://localhost:3000` for development) as authorized JavaScript origins.
2. Add this Supabase callback as an authorized redirect URI: `https://wnymtskjnmuzuaqdrewc.supabase.co/auth/v1/callback`.
3. In the [Supabase Google provider settings](https://supabase.com/dashboard/project/wnymtskjnmuzuaqdrewc/auth/providers?provider=Google), enable Google and enter the OAuth Client ID and Client Secret.
4. In Supabase **Authentication → URL Configuration**, set the deployed app as the Site URL and add the app's `/auth/callback`, `/reset-password`, and `/home` URLs to the redirect allow list. Add the corresponding `http://localhost:3000` URLs for local development.

The Google OAuth Client Secret stays in Supabase Auth settings. It is not a browser API key and must not go in the app or GitHub.

## Deploy to Cloudflare Workers

This full-stack Next.js app uses Cloudflare Workers through the OpenNext adapter. Cloudflare Pages static export cannot run its authenticated server routes and middleware.

The GitHub Actions workflow `.github/workflows/deploy-cloudflare.yml` builds and deploys on pushes to `main`. In the GitHub repository, add these repository Actions secrets:

- `CLOUDFLARE_API_TOKEN` — a Cloudflare API token permitted to deploy Workers.
- `CLOUDFLARE_ACCOUNT_ID` — the account ID for the Cloudflare account.

The Supabase URL and publishable key are public app configuration in `wrangler.jsonc`. Cloudflare API credentials used to deploy the website are GitHub Actions secrets; inference credentials are separate Supabase Edge Function secrets. After deployment, add the site URL to the Supabase Auth redirect allow list and Google authorized JavaScript origins.

To preview or deploy from a local checkout, run `pnpm preview:cloudflare` or `pnpm deploy:cloudflare` after authenticating Wrangler with Cloudflare.

## AdSense

The existing AdSense publisher tag is loaded on the public landing page only. Private journal, analysis, and account pages do not load the ad script. Ad placement and delivery remain subject to AdSense account approval and settings.

## Data and privacy

- The database has profiles, notebooks, dated journals, undated notes, saved memories, cognitive insights, and game results. All exposed user tables enable RLS and user rows are isolated by `auth.uid()`.
- No sample journals, notes, or memories are seeded. Only a signed-in user's own entries appear in their account.
- Sequence Recall and Pattern Match save the user's own results and show personal score history.
- Analysis uses writing-pattern observations and a comparison with earlier requested analyses. It does not produce a score, diagnosis, or medical assessment.
- When explicitly requested, the selected journal and up to five earlier analysis summaries are sent from the authenticated app server to Cloudflare Workers AI. The saved analysis remains in Supabase under the user's account.
- The project uses only the publishable Supabase key in the browser. No Supabase admin key is included.
