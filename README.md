# Kiln

Next.js 15 + Supabase. Login (password, magic link, Google), profile, credit ledger (100-credit welcome grant), 2 free live job slots, public job board with JobPosting markup.

## Run locally
    cp .env.example .env.local   # already filled for the connected project
    npm install && npm run dev

## Deploy to Vercel
1. Push to GitHub, import the repo in Vercel (framework: Next.js).
2. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. In Supabase > Authentication > URL Configuration set Site URL to your Vercel URL and add `https://<your-domain>/auth/callback` to Redirect URLs.
4. (Optional) enable the Google provider in Supabase.

Enrichment needs ENRICHMENT_API_KEY and SUPABASE_SERVICE_ROLE_KEY (server-only). Confirm your data provider permits resale before launch.
