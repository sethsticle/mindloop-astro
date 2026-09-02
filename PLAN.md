# Mindloop Astro - Conversion Plan

Source: `mindloop-frontend/` (Lovable / TanStack Start / React 19)  
Target: `mindloop-astro/` (Astro 5 static / Tailwind v4 / Vanilla JS)

---

## Translation Rules (apply throughout)

| React/Lovable | Astro equivalent |
|---|---|
| `framer-motion` `fadeUp()` | `data-reveal` + `data-delay="0.1"` attrs → `reveal.js` IntersectionObserver |
| `motion.button` `whileHover/whileTap` | CSS `transition-transform hover:scale-[1.03] active:scale-[0.98]` |
| `lucide-react` icons | Inline SVG (copy from lucide.dev, `width="16" height="16"`) |
| `<Link to="/">` TanStack Router | Plain `<a href="/">` |
| `hls.js` via `useEffect` + `useRef` | `hls.js` via vanilla `<script>` block inside component |
| `cn()` / `clsx` class merging | Direct Tailwind classes, no utility needed |
| `HSL CSS vars` via `hsl(var(--x))` | Already in `global.css` as `--color-*` tokens, use `var(--color-x)` |
| React component props | Astro `interface Props` + `Astro.props` destructure |
| `font-serif` class | `font-[family-name:var(--font-serif)]` or add `.font-serif` rule in global.css |

---

## Steps

### Step 1 - Foundation ✅
- [x] Astro project scaffolded (`npm create astro` minimal template)
- [x] Tailwind v4 wired via `@tailwindcss/vite` in `astro.config.mjs`
- [x] `@fontsource/inter` + `@fontsource/instrument-serif` installed and imported in `global.css`
- [x] CSS tokens (`--color-*`, `--font-*`) and `.liquid-glass` ported to `global.css @theme`
- [x] `reveal.js` vanilla IntersectionObserver written to `public/scripts/`
- [x] `Base.astro` layout shell (head, meta, font load, reveal.js script)
- [x] Page stubs: `index.astro`, `about.astro`, `contact.astro`
- [x] Component stubs: `Navbar.astro`, `Footer.astro`, `Logo.astro`, `HlsVideo.astro`
- [x] Directory structure: `src/{styles,layouts,components,scripts}`, `public/{assets/{video,images},scripts}`

### Step 2 - Shared Components (Navbar, Footer, Logo) ✅
Port `site.tsx` → three Astro components. No JS needed - pure HTML/CSS.
- `Logo.astro`: concentric circles `<div>` - accepts `outer` + `inner` class props
- `Navbar.astro`: fixed top bar, logo + nav links + liquid-glass social icon buttons (inline SVGs for Instagram/LinkedIn/Twitter)
- `Footer.astro`: copyright + Privacy/Terms/Contact links

### Step 3 - Hero Section (`index.astro`) ✅
Most complex section - contains video, avatar row, heading, subscribe form.
- `<video>` tag: `autoplay muted loop playsinline`, `src` points to local asset path (see `ASSETS.md`)
- Avatar images: `<img>` tags, local paths from `public/assets/images/`
- Subscribe form: `liquid-glass` pill, transparent input, white rounded-full button
- All `data-reveal` + `data-delay` attrs replace `{...fadeUp(n)}`
- Form is static/decorative at this stage (no backend yet)

### Step 4 - Content Sections (SearchChanged + Mission) ✅
Pure HTML - zero JS needed beyond reveal.
- `SearchChanged`: inline SVGs for Bot/Sparkles/Search icons in liquid-glass square cards
- `Mission`: `<video>` tag (local path), mixed-color paragraph using `<span>` with muted/foreground classes

### Step 5 - Solution Section ✅
Pure HTML. `<video>` tag + 4-col feature grid. No interactivity.

### Step 6 - CTA Section with HLS Video (`HlsVideo.astro`) ✅
`hls.js` is the one genuine JS dependency kept.
- Install: `npm install hls.js`
- `HlsVideo.astro`: `<video data-hls-src>` + processed `<script>` using `import Hls from 'hls.js'`, `querySelectorAll` handles multiple instances, Astro deduplicates the script
- `Hls.isSupported()` check + Safari native HLS fallback - mirrors `HlsVideo.tsx` logic exactly
- CTA section: absolute positioned HlsVideo + overlay + logo + heading + two buttons
- Note: hls.js adds ~500 KB to the JS bundle (Vite chunk warning expected, not an error)

### Step 7 - About Page ✅
- Hero: centered heading with serif italic, subtitle
- Manifesto bento: CSS Grid 2-col, 3 liquid-glass cards with inline SVGs (Shield, Scale, Leaf) via `set:html`

### Step 8 - Contact Page ✅
- Split 12-col grid: left (heading + contact details), right (liquid-glass form)
- Form inputs: borderless bottom-border style, transparent bg
- Submit button: full-width white rounded-full

### Step 9 - Assets & Polish ✅
- All CloudFront/Mux mp4 URLs replaced with local `/assets/video/` paths
- Mux HLS stream kept as external URL per ASSETS.md (can't be downloaded)
- `reveal.js` delays match framer-motion source exactly
- Mobile nav: links hidden on mobile (`hidden md:flex`) - hamburger deferred, not present in source either
- Asset dirs created: `public/assets/video/`, `public/assets/images/`

### Step 10 - Dev server verification
`npm run dev` - walk all 3 pages, check: fonts load, video plays, liquid-glass renders, scroll reveals fire, HLS stream works.
- Build verified clean (3 pages, ~1s). Awaiting asset upload before visual walk-through.

---

## NOTE to KB

### `decision-hlsvideo-data-attr-pattern` - Pass src to HlsVideo via `data-hls-src` attribute, not `define:vars`
`define:vars` forces `is:inline` on the script, which blocks npm imports. Using `data-hls-src` on the `<video>` element and reading it in a processed `<script>` block keeps the npm import path open and lets Astro deduplicate the script when multiple HlsVideo components appear on the same page.

### `err-hlsjs-chunk-size` - hls.js produces a ~500 KB Vite chunk (warning, not error)
Vite warns when any chunk exceeds 500 KB. hls.js minified is ~450–550 KB. The warning is cosmetic - it does not break the build. Suppress with `build.chunkSizeWarningLimit: 600` in `astro.config.mjs` if it becomes noise. Applies to any boilerplate tier that ships `HlsVideo.astro`.

### `err-tailwindcss-vite-rolldown` - `@tailwindcss/vite` >=4.2.4 breaks with Vite 8 / rolldown
`@tailwindcss/vite` >=4.2.4 pulls Vite 8 as a peer which uses rolldown instead of rollup. This breaks the plugin. Fix: add a `overrides` / `resolutions` block in `package.json` to pin `vite` to `^5.4.0`. This is the clean solution; downgrading `@tailwindcss/vite` is the fallback. Applies to all Astro 5/6 boilerplate tiers.

### `decision-mindloop-keystatic-cms` - Added Keystatic (GitHub-storage) for Jobs + Mission Logs, moved deploy target from Xneelo to Cloudflare Workers
MLD needed to self-service job postings and case studies ("mission logs") without a code edit per change, so a `jobs` and `missionLogs` Keystatic collection were added (`keystatic.config.ts` + `src/content.config.ts`, per the two-file rule in pcl-astro's `decision-keystatic-collection-setup.md`). This required switching this project's deploy target from static/Xneelo to `@astrojs/cloudflare` (adapter, `wrangler.jsonc`, `generate-types`/`deploy` scripts) - Keystatic's hosted admin UI needs a server runtime to commit via the GitHub App. **This contradicts the `@cloudflare/vite-plugin` removal note in the "What Was Dropped" table below** - that removal was correct for the original brief (static Xneelo site with no CMS); it no longer holds now that a CMS is in scope. Applies to any demo-tier project that later gets a "let the client self-serve X" request.

### `decision-keystatic-fields-url-not-image` - Use `fields.url` for image URLs migrated from hardcoded placeholder data, not `fields.image`
The 5 migrated Mission Log entries carry external Unsplash placeholder URLs (`img`, `gallery`). `fields.image` expects a locally-uploaded file relative to a `directory`/`publicPath` pair - pointing it at pre-existing external URLs shows as broken/invalid in the Keystatic UI the moment an editor opens the entry. `fields.url` accepts any hosted URL string with no upload requirement, matches the placeholder data as-is, and still lets MLD paste a real client photo URL later. Swap to `fields.image` only once there's an actual local-upload workflow for these images.

### `err-keystatic-cf-workers-v13-runtime-env` - `@keystatic/astro` v5 breaks under `@astrojs/cloudflare` v13 without a middleware shim
Keystatic v5 reads secrets via `Astro.locals.runtime.env` (the Astro v5 API). The CF adapter v13 + Astro v6 removed that in favour of `import { env } from 'cloudflare:workers'`, and `locals.runtime` is now non-writable. Without `src/middleware.ts` restoring `runtime.env` via `Object.defineProperty`, `/keystatic` 500s. Also: `astro.config.mjs` needs an explicit `site:` value or `Astro.site` is `undefined` and the homepage silently builds as a blank HTML shell (no build error). Both caught by comparing against pcl-astro's validated `CLOUDFLARE-SETUP.md` after the fact - should have been applied at the same time as the adapter/integration wiring, not discovered later. Applies to every Astro 6 + CF Workers + Keystatic v5 project until Keystatic ships a fix.

### `decision-keystatic-yaml-not-markdoc` - Plain `format: 'yaml'` collections, not Markdoc, for Jobs and Mission Logs
Every field in both collections (summary, description, challenge, solution, results) is a single paragraph, not structured rich text. Markdoc would require adding `@astrojs/markdoc` as a new integration/dependency and a render() step for zero real benefit. `format: 'yaml'` (data-only collection, no content field) keeps the diff smaller and matches the existing plain-string shape of the pre-Keystatic `caseStudies.ts` data.

---

## Video Streaming - Implementation Notes

### What was implemented (Steps 1 + 2)

**Step 1 - MP4 Faststart encoding**
All source videos re-encoded (lossless atom reorder) with:
```bash
ffmpeg -i INPUT.mp4 -movflags +faststart -c copy OUTPUT.mp4
```
This moves the `moov` atom to the front of the file so browsers can begin playback on the first HTTP response bytes rather than waiting for the full file. Required for `preload="metadata"` to be meaningful.

**Step 2 - `VideoAutoplay.astro` + `video-lazy.js` + `video-fade.js`**
- `src/components/VideoAutoplay.astro`: replaces plain `<video>` tags for all local MP4s. Props:
  - `eager=true` (hero, above fold): sets `src` directly, `preload="metadata"`. Faststart moov atom means playback starts on first bytes.
  - `eager=false` (default, below fold): `preload="none"`, `data-video-src` attribute only. Zero video bytes downloaded on page load.
  Two JS-managed end-of-video behaviours are available (both remove `loop` and hand control to `video-fade.js`):

  - `fade=true` — opacity fades to 0 over the last 1.5 s, then video restarts at full opacity. Use for looping backgrounds where you want a dissolve instead of a hard cut.
  - `freeze=true` — full opacity throughout; `playbackRate` ramps down to near-zero over the last 2.5 s, then pauses on the final frame. Use for hero videos that should play once and hold. **This is what the Mindloop hero uses.**

  ```astro
  <!-- Standard seamless loop (default) -->
  <VideoAutoplay src="/assets/video/hero.mp4" eager />

  <!-- Fade-to-black then restart (looping) -->
  <VideoAutoplay src="/assets/video/hero.mp4" eager fade />

  <!-- Slow freeze on last frame, no loop (hero) -->
  <VideoAutoplay src="/assets/video/hero.mp4" eager freeze />
  ```

- `public/scripts/video-lazy.js`: standalone IIFE using `IntersectionObserver` with `rootMargin: 300px`. Swaps `data-video-src` → `src` when video enters proximity. Skips already-src'd eager videos. Falls back to immediate load if IntersectionObserver unavailable.
- `public/scripts/video-fade.js`: standalone IIFE handling both behaviours:
  - `video[data-fade]` — `timeupdate` ramps `opacity` 1→0 over last `FADE_SECONDS` (1.5 s). On `ended`: resets to frame 0, opacity 1, calls `play()`.
  - `video[data-freeze]` — `timeupdate` ramps `playbackRate` 1→0.05 over last `FREEZE_SECONDS` (2.5 s). On `ended`: pauses and snaps `currentTime` to `duration` (holds last frame).
  - Tune durations via the constants at the top of the file.
- `Base.astro`: loads all three scripts (`reveal.js`, `video-lazy.js`, `video-fade.js`) via `<script defer>`.
- `HlsVideo.astro`: unchanged - kept for actual HLS streams (Mux CTA or future local HLS).

**When swapping in a new video:** pick `fade` or `freeze` prop depending on the desired end behaviour. No other changes needed — `video-fade.js` is already loaded globally.

**Boilerplate propagation rule:** Any boilerplate tier with background/decorative video must use `VideoAutoplay.astro` (not bare `<video>`). Hero-equivalent sections use `eager`, everything below fold does not.

---

### Step 4 - Static HLS with hls.js on Xneelo (Detailed Plan)

**Concept:** ffmpeg converts each source MP4 into a static HLS playlist (`.m3u8`) + segment files (`.ts`). These plain files are uploaded alongside the Astro `dist/` output. Apache serves them statically. The browser (via hls.js) assembles them into a seamless stream.

**Why this matters over faststart-MP4:**
- HLS segments (~6s each) mean the browser downloads only what it needs to play next - a user who leaves after 10s downloads ~12s of video, not 20MB.
- Adaptive bitrate is possible (multiple quality playlists + master playlist).
- First segment (6s) is typically under 2MB - visible content starts before the full file arrives.

---

#### Pre-build encode step

A `scripts/encode-hls.sh` at the project root handles all videos. Run once when source video changes; output is committed to `public/`.

```bash
#!/bin/bash
# encode-hls.sh - convert source MP4s to static HLS
# Usage: bash scripts/encode-hls.sh
# Requires: ffmpeg (brew install ffmpeg)

set -e

SOURCE_DIR="video-source"        # raw originals, NOT in public/
OUTPUT_DIR="public/assets/video"

for INPUT in "$SOURCE_DIR"/*.mp4; do
  NAME=$(basename "$INPUT" .mp4)
  OUT="$OUTPUT_DIR/$NAME"
  mkdir -p "$OUT"

  ffmpeg -y -i "$INPUT" \
    -c:v libx264 -preset slow -crf 22 \
    -profile:v high -level 4.1 \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    -hls_time 6 \
    -hls_playlist_type vod \
    -hls_segment_filename "$OUT/seg%03d.ts" \
    "$OUT/index.m3u8"

  echo "✓ $NAME → $OUT/index.m3u8"
done
```

Add to `package.json`:
```json
"scripts": {
  "encode": "bash scripts/encode-hls.sh",
  "dev": "astro dev",
  "build": "astro build"
}
```

---

#### Output directory structure

```
public/assets/video/
├── hero/
│   ├── index.m3u8        # HLS playlist
│   ├── seg000.ts         # ~6s each
│   ├── seg001.ts
│   └── ...
├── mission/
│   └── ...
└── solution/
    └── ...
video-source/             # originals, gitignored (large files)
├── hero.mp4
├── mission.mp4
└── solution.mp4
```

Add to `.gitignore`:
```
video-source/
```

---

#### Apache MIME types (.htaccess)

Xneelo's Apache doesn't know `.m3u8` or `.ts` by default. Add to `.htaccess` (in `public/`):

```apache
# HLS MIME types
AddType application/vnd.apple.mpegurl .m3u8
AddType video/mp2t .ts
```

Without this, Apache serves `.m3u8` as `text/plain` and hls.js will throw a parse error.

---

#### HlsVideo.astro - no changes needed

The existing `HlsVideo.astro` already handles:
- `Hls.isSupported()` → hls.js path (Chrome, Firefox)  
- `video.canPlayType('application/vnd.apple.mpegurl')` → native path (Safari, iOS)

Once encode is done, usage changes from Mux URL to local path:
```astro
<!-- Before (Mux external): -->
<HlsVideo src="https://stream.mux.com/abc.m3u8" class="..." />

<!-- After (local static HLS): -->
<HlsVideo src="/assets/video/hero/index.m3u8" class="..." />
```

Hero and other decorative videos switch from `VideoAutoplay` + MP4 to `HlsVideo` + local `.m3u8`. The `video-lazy.js` IntersectionObserver is NOT used with `HlsVideo` - hls.js manages its own segment fetching and already downloads lazily by nature (it only fetches the next segment, not the whole video). For below-fold HLS videos, add `preload="none"` to the `<video>` element inside `HlsVideo.astro` and call `hls.startLoad()` inside the IntersectionObserver callback instead of on attach.

---

#### Xneelo deployment checklist for HLS

1. Run `npm run encode` locally - generates `public/assets/video/[name]/` dirs
2. `npm run build` - Astro copies everything in `public/` to `dist/`
3. Upload `dist/` contents to `public_html/` (same as current process)
4. Confirm `.htaccess` contains `AddType` lines for `.m3u8` and `.ts`
5. Test: open DevTools Network tab, filter by `m3u8` - you should see a 200 for `index.m3u8` and then sequential `seg*.ts` requests

---

#### Decision: Cloudflare CDN (deferred)

When DNS control is available, point the domain through Cloudflare (free tier). Cloudflare caches `.ts` segments at edge - subsequent visitors stream from the nearest PoP rather than the Xneelo server. No code changes needed; purely a DNS routing decision.

**Without Cloudflare (current constraint):** faststart + HLS segments on Xneelo is still dramatically faster than WordPress-served video. The 5–10s stall is eliminated by the faststart moov atom alone; HLS chunking reduces bandwidth per visitor.

Cloudflare also offers **Cloudflare Stream** ($5/mo for ~1000 min stored) as a fully managed HLS CDN - drop-in replacement for the local `.m3u8` URL in `HlsVideo.astro`. This is the easiest upgrade path if the static HLS segment file count becomes unwieldy.

---

### `decision-video-lazy-vs-hls` - Use VideoAutoplay+MP4 now, migrate to HlsVideo+local HLS when encode step is set up
For the first deploy, faststart MP4 + IntersectionObserver lazy loading eliminates the cold-start stall with zero new infrastructure. The static HLS encode step requires ffmpeg + a build script and produces many files to deploy. The migration is non-breaking: swap `VideoAutoplay src="x.mp4"` for `HlsVideo src="x/index.m3u8"` per video. Do not mix the two patterns for the same video.

### `decision-eager-prop` - Hero video is the only above-fold video that gets eager=true
Only one video per page should set `eager`. For 100vh hero backgrounds, the browser must begin streaming immediately. All other videos are below the fold and cost the user bandwidth before they ever see them if loaded eagerly.

### `decision-cloudflare-deferred` - Document Cloudflare CDN as upgrade path, do not implement on sites without DNS control
Cloudflare requires pointing nameservers or adding the site as a zone. On client handover projects where DNS is managed by the client, document the option in the project's handover doc. The faststart + HLS combination is sufficient for Xneelo-direct delivery on 10–20MB sub-1-minute clips.

---

## What Was Dropped

| Removed | Reason |
|---|---|
| All 20 `@radix-ui/*` packages | None used in actual pages |
| All `shadcn/ui` components (`ui/`) | None used in actual pages |
| `framer-motion` | Replaced by `reveal.js` + CSS transitions |
| `lucide-react` | Replaced by inline SVG |
| `@tanstack/react-router` + `react-start` | Astro handles routing natively |
| React + ReactDOM | Astro components are zero-JS by default |
| `react-hook-form`, `zod`, `recharts`, etc. | Unused in source pages |
| `clsx`, `tailwind-merge`, `class-variance-authority` | Unnecessary without React components |
| `tw-animate-css` | Replaced by `.will-reveal`/`.revealed` in global.css |
| `@cloudflare/vite-plugin` | Xneelo target, not Cloudflare |
