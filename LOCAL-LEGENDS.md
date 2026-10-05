# Local Legends - Operator Runbook

Temporary voting competition page at `/local-legends`. Built from MLD's dev brief +
`local-legends-design.html` prototype, styled to match the current site (not the
prototype's navy/starfield look). Disposable - see "Shutting it down" at the bottom
for what to actually delete once the competition ends.

---

## How voting works

1. Legend roster (name, description, video, thumbnail) is a **Keystatic collection**
   (`legends`, editable at `/keystatic` same as Jobs and Mission Logs) - low-frequency,
   author-managed content, not a database row.
2. Votes are the only dynamic part, stored in **Cloudflare D1** (`mindloop-astro-legends`
   database, `votes` table, `migrations/0001_votes.sql`). `email` is the table's
   `PRIMARY KEY` - that's the actual "one vote per person" enforcement, not app logic.
3. A vote counts instantly: `POST /api/legends/vote` (Turnstile check + deadline
   check) writes the row straight in as `confirmed` - no email round-trip. This
   replaced an earlier double opt-in (email confirm link) design; see
   `git show beec4a8` ("auto confirm") for what changed and why.
4. Submitting again with the same email is rejected with "You've already voted" -
   `email` is the table's `PRIMARY KEY`, so there's no "change your mind" path
   anymore.

## Config you'll actually touch

Both values live in one place: `src/lib/local-legends-config.ts`.

| Value | What it does | Current state |
|---|---|---|
| `VOTING_CLOSES_AT` | Hard cutoff - `vote.ts` rejects submissions after this, and the page flips its buttons to "Voting closed" | Placeholder date, **needs Michael's real value before launch** |
| `LEADERBOARD_LIVE` | `true` = vote counts show on gallery cards immediately. `false` = hidden until `VOTING_CLOSES_AT` passes (auto-reveals then, regardless of the flag) | `false` (hidden until close), **needs Michael's confirmation** |

Edit the file, commit, push - the GitHub Actions workflow deploys it.

## Viewing / auditing votes

Nothing on the page shows counts right now (`LEADERBOARD_LIVE` is `false` and voting
hasn't closed). Two ways to check anyway:

**Cloudflare dashboard** (no CLI): `dash.cloudflare.com` -> Workers & Pages -> D1 ->
`mindloop-astro-legends` -> **Console** tab (run SQL) or **Tables** tab (browse rows).

**CLI**:
```bash
# Total confirmed vote count (all legends)
npx wrangler d1 execute mindloop-astro-legends --remote --command="SELECT COUNT(*) as total_votes FROM votes WHERE status='confirmed'"

# Confirmed vote count per legend
npx wrangler d1 execute mindloop-astro-legends --remote --command="SELECT legend_id, COUNT(*) as votes FROM votes WHERE status='confirmed' GROUP BY legend_id ORDER BY votes DESC"

# List every confirmed voter, grouped by legend
npx wrangler d1 execute mindloop-astro-legends --remote --command="SELECT legend_id, email, created_at FROM votes WHERE status='confirmed' ORDER BY legend_id, created_at"

# List every confirmed voter for one specific legend
npx wrangler d1 execute mindloop-astro-legends --remote --command="SELECT email, created_at FROM votes WHERE status='confirmed' AND legend_id='LEGEND_SLUG_HERE' ORDER BY created_at"

# Look up a single voter by email
npx wrangler d1 execute mindloop-astro-legends --remote --command="SELECT email, legend_id, status, created_at, confirmed_at FROM votes WHERE email='someone@example.com'"

# Every row regardless of status (in practice all rows are 'confirmed' now - see "How voting works" above)
npx wrangler d1 execute mindloop-astro-legends --remote --command="SELECT email, legend_id, status, created_at, confirmed_at FROM votes ORDER BY created_at DESC"
```

Drop `--remote` to query the local Miniflare-simulated D1 instead (only has data from
local `npm run dev` testing, not real votes).

## Infra checklist

| Piece | Status | Where it's set |
|---|---|---|
| D1 database + `votes` table | Done | `wrangler.jsonc` `d1_databases[0]`, migrated via `npm run db:migrate:remote` |
| Turnstile site key | Done | `wrangler.jsonc` `vars.PUBLIC_TURNSTILE_SITE_KEY` (public, committed) |
| Turnstile secret key | Done | `wrangler secret put TURNSTILE_SECRET_KEY` (not in any file) |
| Turnstile widget domains | Done | Cloudflare dashboard -> Turnstile -> widget -> Settings -> Domains. Currently allows both `mindloop-astro.webdoordev.workers.dev` and `mldmarketing.co.za` - add the eventual custom domain there too if it changes again |
| Resend confirm-email sending | **Removed** (see `git show beec4a8`) | Votes count instantly now, no email sent. `confirm_token` column is still written (`NOT NULL` from the old schema) but nothing reads it - `src/pages/api/legends/confirm.ts` no longer exists, so any pre-Sep-13 "Confirm your vote" email still in someone's inbox links to a dead route. Safe to ignore / tell them their vote already counted. |

### A pattern worth remembering for next time

Three separate services (GitHub App callback URL, Turnstile widget domains, and -
differently shaped - the D1 binding name) all broke the first time for the same
underlying reason: **whatever's registered in the external service's dashboard has
to match the URL the site is actually being served from right now**
(`mindloop-astro.webdoordev.workers.dev`), not the eventual real domain
(`mldmarketing.co.za`), which is still serving the WordPress splash page. When the
real domain cuts over, go back and add it alongside the workers.dev entry in each of:
GitHub App (Homepage + Callback URL), Turnstile widget (Domains).

## Still blocked on MLD before launch

- Final Legends roster (names, one-line descriptions, thumbnails, video files or links)
  - swap into the `legends` Keystatic collection, replacing `legend-1-placeholder.yaml`
    / `legend-2-placeholder.yaml`
- Real voting close date/time -> `VOTING_CLOSES_AT`
- Leaderboard visibility confirmation -> `LEADERBOARD_LIVE`
- Confirmation a light-background MLD logo asset actually exists (brief references
  one; not present in `public/` yet)
- Video hosting decision (local MP4 vs YouTube/Vimeo unlisted vs Cloudflare Stream) -
  held off pending final Legend count/video length. Current placeholders use YouTube
  embed links; `toEmbedUrl()` in `local-legends.astro` also supports Vimeo, so this is
  a data change if the decision changes, not a code change - unless local MP4 hosting
  is chosen, which would need `local-legends.astro`'s video modal reworked to swap the
  `<iframe>` for a `<video>` element for local files.

## Shutting it down (once the competition closes and results are announced)

Deleting the page is not the same as removing everything - do all of these:

1. Delete `src/pages/local-legends.astro`, `src/pages/api/legends/`,
   `src/lib/local-legends-config.ts`, `src/content/legends/` (and the `legends`
   collection from `keystatic.config.ts` + `content.config.ts`)
2. Drop the `votes` table: `npx wrangler d1 execute mindloop-astro-legends --remote --command="DROP TABLE votes"`
   (or delete the whole D1 database from the Cloudflare dashboard if nothing else uses it)
3. Delete the Turnstile widget in the Cloudflare dashboard, and remove
   `TURNSTILE_SECRET_KEY` (`wrangler secret delete TURNSTILE_SECRET_KEY`) and
   `PUBLIC_TURNSTILE_SITE_KEY` (`wrangler.jsonc`)
4. Remove `d1_databases` from `wrangler.jsonc` if the database itself was deleted in step 2
5. Navbar promo: in `src/components/Navbar.astro` set `SHOW_LOCAL_LEGENDS_PROMO = false`
   (or delete the two gated wordmark blocks outright), and restore
   `--breakpoint-nav` to `1240px` in `src/styles/global.css` (raised to `1470px`
   only to fit the wordmark button)
