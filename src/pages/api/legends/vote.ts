import type { APIRoute } from "astro";
import { env } from "cloudflare:workers"; // CF Workers env access in Astro v6
import { isVotingOpen } from "../../../lib/local-legends-config";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const db = env.DB;
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;

  if (!db || !turnstileSecret) {
    return json({ error: "Voting is not configured." }, 500);
  }

  if (!isVotingOpen()) {
    return json({ error: "Voting has closed." }, 403);
  }

  const formData = await request.formData();
  const legendId = str(formData.get("legendId"));
  const email = str(formData.get("email")).toLowerCase();
  const turnstileToken = str(formData.get("cf-turnstile-response"));
  const trap = str(formData.get("website")); // honeypot

  if (trap.length > 0) return json({ ok: true }, 200); // silent bot bail

  if (!legendId || !email || !turnstileToken) {
    return json({ error: "Required fields missing." }, 400);
  }

  // A real Turnstile token is well under 2KB - anything longer is junk/an attack.
  if (turnstileToken.length > 2048) {
    return json({ error: "Verification failed. Please try again." }, 400);
  }

  // Hostnames the Turnstile widget is served from - siteverify's `hostname` must
  // be one of these. Keep in sync with the widget's Domains list in the Cloudflare
  // dashboard (Turnstile -> widget -> Settings -> Domains). localhost entries are
  // for local `npm run dev` testing and are harmless in prod (a token would have
  // to be minted from a page actually served on localhost).
  const ALLOWED_TURNSTILE_HOSTS = new Set([
    "mldmarketing.co.za",
    "www.mldmarketing.co.za",
    "mindloop-astro.webdoordev.workers.dev",
    "localhost",
    "127.0.0.1",
  ]);

  // Passed to siteverify so Cloudflare can factor the client IP into scoring.
  const clientIp = request.headers.get("CF-Connecting-IP") ?? "";
  const verifyParams = new URLSearchParams({ secret: turnstileSecret, response: turnstileToken });
  if (clientIp) verifyParams.set("remoteip", clientIp);

  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyParams,
  });
  const verifyBody = (await verify.json().catch(() => ({}))) as {
    success?: boolean;
    action?: string;
    hostname?: string;
  };
  // Three checks: token valid + issued for the vote widget (data-action="vote" in
  // local-legends.astro) + served from a hostname we recognise.
  if (
    !verifyBody.success ||
    verifyBody.action !== "vote" ||
    !verifyBody.hostname ||
    !ALLOWED_TURNSTILE_HOSTS.has(verifyBody.hostname)
  ) {
    return json({ error: "Verification failed. Please try again." }, 400);
  }

  const existing = await db
    .prepare("SELECT status FROM votes WHERE email = ?")
    .bind(email)
    .first<{ status: string }>();

  if (existing) {
    return json({ error: "You've already voted." }, 409);
  }

  // confirm_token is kept only because the column is NOT NULL from the old
  // email-confirm flow - it's unused now that votes count instantly.
  const confirmToken = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO votes (email, legend_id, status, confirm_token, created_at, confirmed_at)
       VALUES (?, ?, 'confirmed', ?, ?, ?)`
    )
    .bind(email, legendId, confirmToken, now, now)
    .run();

  return json({ ok: true }, 200);
};

function str(val: FormDataEntryValue | null): string {
  return typeof val === "string" ? val.trim() : "";
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
