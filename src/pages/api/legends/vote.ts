import type { APIRoute } from "astro";
import { env } from "cloudflare:workers"; // CF Workers env access in Astro v6
import { isVotingOpen } from "../../../lib/local-legends-config";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const db = env.DB;
  const resendKey = env.RESEND_API_KEY;
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;

  if (!db || !resendKey || !turnstileSecret) {
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

  if (existing?.status === "confirmed") {
    return json({ error: "You've already voted." }, 409);
  }

  const confirmToken = crypto.randomUUID();
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO votes (email, legend_id, status, confirm_token, created_at)
       VALUES (?, ?, 'pending', ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         legend_id = excluded.legend_id,
         confirm_token = excluded.confirm_token,
         created_at = excluded.created_at,
         status = 'pending'`
    )
    .bind(email, legendId, confirmToken, now)
    .run();

  const siteUrl = env.PUBLIC_SITE_URL || "https://mldmarketing.co.za";
  const confirmUrl = `${siteUrl}/api/legends/confirm?token=${confirmToken}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MLD Local Legends <admin@mldmarketing.co.za>",
      to: [email],
      subject: "Confirm your Local Legends vote",
      html: buildConfirmEmailHtml(confirmUrl),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    console.error("[legends/vote] Resend error:", res.status, body.message);
    return json({ error: "Failed to send confirmation email." }, 502);
  }

  return json({ ok: true }, 200);
};

function buildConfirmEmailHtml(confirmUrl: string): string {
  return `
<div style="background:#F4F1EA;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="background:#1A254C;padding:28px 32px;">
        <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#F69422;">MLD Marketing Solutions</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:600;color:#FFFFFF;">Confirm Your Vote</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px;">
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1A1A1A;">One more step - click below to confirm your Local Legends vote. It only counts once confirmed.</p>
        <a href="${confirmUrl}" style="display:inline-block;background:#0CA99E;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;">Confirm My Vote</a>
        <p style="margin:20px 0 0;font-size:12px;color:#8A8578;">If you didn't request this, you can safely ignore this email.</p>
      </td>
    </tr>
  </table>
</div>`;
}

function str(val: FormDataEntryValue | null): string {
  return typeof val === "string" ? val.trim() : "";
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
