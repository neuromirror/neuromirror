# NeuroMirror

NeuroMirror is a private journal built around cognitive-language awareness: people choose entries to analyze, build a history of writing patterns, and reflect on how their writing changes. The observations are informational and non-diagnostic. Journals, notes, analyses, and game results are scoped to the signed-in user with Supabase Auth and row-level security. Accounts begin empty; the example excerpt on the landing page is static display copy and is never stored.

## Run locally

1. Install Node.js 22 and pnpm 11.
2. Run `pnpm install --frozen-lockfile`.
3. Copy `.env.example` to `.env.local`. The supplied values point at the connected Supabase project; update them if you use another project.
4. Run `pnpm dev` and visit `http://localhost:3000`.

Supabase handles email/password and Google sign-in. Google sign-in requires OAuth credentials from your Google account; setup is below. Gemini analysis runs in a Supabase Edge Function, so its key does not belong in `.env.local`, GitHub, or Cloudflare.

## Supabase setup

This app is connected to Supabase project **neuromirror** (`wnymtskjnmuzuaqdrewc`). The database migrations are in `supabase/migrations/`; the initial schema and row-level security policies have been applied.

### Enable Gemini cognitive-language analysis

Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey). Add it to the Supabase project at **Edge Functions → Secrets** with the name `GEMINI_API_KEY`. You can also use `supabase secrets set GEMINI_API_KEY=your-key --project-ref wnymtskjnmuzuaqdrewc` from a logged-in Supabase CLI. Do not commit the key or put it in a `NEXT_PUBLIC_` variable.

The `cognitive-analysis` Edge Function is deployed to the connected project. It checks the user's session, reads the selected journal through row-level security, and saves the requested report under that account. It sends Gemini the selected journal and up to five earlier analysis summaries; it does not send other journal entries. Autosave never invokes analysis. Re-deploy code changes with `supabase functions deploy cognitive-analysis --project-ref wnymtskjnmuzuaqdrewc` after logging in to the Supabase CLI.

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

The Supabase URL and publishable key are public app configuration in `wrangler.jsonc`. Gemini remains in Supabase Edge Function Secrets. After the first deployment, add the Cloudflare Worker URL to the Supabase Auth redirect allow list and Google authorized JavaScript origins.

To preview or deploy from a local checkout, run `pnpm preview:cloudflare` or `pnpm deploy:cloudflare` after authenticating Wrangler with Cloudflare.

## AdSense

The existing AdSense publisher tag is loaded on the public landing page only. Private journal, analysis, and account pages do not load the ad script. Ad placement and delivery remain subject to AdSense account approval and settings.

## Data and privacy

- The database has profiles, notebooks, dated journals, undated notes, saved memories, cognitive insights, and game results. All exposed user tables enable RLS and user rows are isolated by `auth.uid()`.
- No sample journals, notes, or memories are seeded. Only a signed-in user's own entries appear in their account.
- Sequence Recall and Pattern Match save the user's own results and show personal score history.
- Analysis uses writing-pattern observations and a comparison with earlier requested analyses. It does not produce a score, diagnosis, or medical assessment.
- The project uses only the publishable Supabase key in the browser. No Supabase admin key is included.
