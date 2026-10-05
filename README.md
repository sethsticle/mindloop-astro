# mindloop-astro

Marketing site for **MLD Marketing Solutions** - `mldmarketing.co.za`.

Astro (static output) + Tailwind v4 + vanilla JS on the front end, deployed to
**Cloudflare Workers**. Content is edited through **Keystatic** (GitHub-backed),
and the temporary *Local Legends* voting competition uses **Cloudflare D1** +
**Resend**.

---

## Stack

| Piece | What / where |
|---|---|
| Framework | Astro 6, `output: 'static'`, `@astrojs/cloudflare` adapter |
| Styling | Tailwind v4 via `@tailwindcss/vite`. Tokens live in `src/styles/global.css` `@theme` |
| JS | Vanilla only in the browser. React is build/admin-time (Keystatic) only |
| CMS | Keystatic at `/keystatic`, GitHub storage, commits straight to `main` |
| DB | Cloudflare D1 `mindloop-astro-legends` - Local Legends vote rows only |
| Mail | Resend - careers applications (`api/apply.ts`) + vote confirmations (`api/legends/vote.ts`) |
| Bot gate | Cloudflare Turnstile on the vote form |
| Analytics | Cloudflare Web Analytics beacon (gated on `PUBLIC_CF_BEACON_TOKEN`) |

---

## Local development

```bash
npm install
cp .env.example .env    # fill in the values you need
npm run dev             # http://localhost:4321
npm run build           # production build to dist/  ("done" = zero errors)
npm run preview         # serve the built output
```

`npm run generate-types` regenerates `wrangler` env types after changing bindings.

---

## Deploying

**Never run a deploy command by hand.** Every push to `main` triggers
`.github/workflows/deploy.yml`, which runs `npm run deploy`
(`astro build && wrangler deploy`). Keystatic saves are commits to `main`, so a
content edit publishes the same way - rapid saves collapse into one deploy via
the workflow's `concurrency` group.

### Required GitHub Actions secrets

Settings -> Secrets and variables -> Actions:

- `CLOUDFLARE_API_TOKEN` - CF dashboard -> My Profile -> API Tokens -> "Edit Cloudflare Workers"
- `PUBLIC_SITE_URL` - `https://mldmarketing.co.za`
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`

`PUBLIC_TURNSTILE_SITE_KEY` is not a secret - it lives in `wrangler.jsonc` `vars`.
The Cloudflare Web Analytics beacon token is public and inlined in
`src/layouts/*.astro`, so it is not a secret either.

---

## Editing content (Keystatic)

Editors go to `mldmarketing.co.za/keystatic` and sign in with GitHub. They need
**Write** access to this repo (Settings -> Collaborators) and must authorize the
Keystatic GitHub App on first sign-in. Saves commit to `main` and deploy
immediately - there is no draft/review gate (see
`PLAN.md` -> `decision-keystatic-no-branch-prefix`).

Collections: **Jobs** (`src/content/jobs`), **Local Legends** (`src/content/legends`).

Mission logs are NOT in Keystatic: edit `src/data/mission-logs.ts` (images in
`public/assets/images/mission-logs/<slug>/`) and redeploy.

---

## Local Legends (temporary competition)

Voting page at `/local-legends`. Everything about it - how voting works, config
flags (`src/lib/local-legends-config.ts`), how to audit votes, the infra
checklist, and the full **shutdown checklist for when the competition ends** -
is in **`LOCAL-LEGENDS.md`**.

The navbar promo button is gated by `VOTING_CLOSES_AT` in
`src/lib/local-legends-config.ts` (see the comment in `src/components/Navbar.astro`):
it shows while voting is open and auto-hides after the close date on the next deploy.

---

## Project docs

- `PLAN.md` - conversion history + architecture decision log ("NOTE to KB")
- `LOCAL-LEGENDS.md` - Local Legends operator runbook + teardown
- `ASSETS.md` - video/image asset handling
