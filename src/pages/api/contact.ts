import type { APIRoute } from "astro";
import { env } from "cloudflare:workers"; // CF Workers env access in Astro v6

export const prerender = false; // static output mode, server this route only

// Resend-verified sender domain + the inbox all site enquiries are routed to.
const FROM_ADDRESS = "admin@mldmarketing.co.za";
const TO_ADDRESSES = ["michael@mldmarketing.co.za", "lara@mldmarketing.co.za"];

// Length caps - server-side enforcement so a scripted POST can't dump huge payloads into the inbox.
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

/*
 * Handles both public enquiry forms, told apart by the `kind` field:
 *   contact    - contact page (name, email, message)
 *   newsletter - homepage "Enter our orbit" box (email only)
 * Both are emailed to TO_ADDRESSES via Resend, with reply_to set to the sender.
 */
export const POST: APIRoute = async ({ request }) => {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return json({ error: "Email service is not configured." }, 500);
  }

  const formData = await request.formData();
  const kind = str(formData.get("kind"));
  const name = str(formData.get("name"));
  const email = str(formData.get("email"));
  const message = str(formData.get("message"));
  const trap = str(formData.get("website")); // honeypot

  if (trap.length > 0) return json({ ok: true }, 200); // silent bot bail

  if (kind !== "contact" && kind !== "newsletter") {
    return json({ error: "Unknown form." }, 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX_EMAIL) {
    return json({ error: "Please enter a valid email address." }, 400);
  }
  if (kind === "contact" && (!name || !message)) {
    return json({ error: "Required fields missing." }, 400);
  }
  if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return json({ error: "Message is too long." }, 400);
  }

  const isContact = kind === "contact";
  const subject = isContact ? `Website enquiry - ${name}` : `Newsletter signup - ${email}`;
  const heading = isContact ? "New Website Enquiry" : "New Newsletter Signup";
  const source = isContact ? "the contact form" : "the homepage signup box";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `MLD Website <${FROM_ADDRESS}>`,
      to: TO_ADDRESSES,
      reply_to: email,
      subject,
      html: buildEmailHtml({ heading, source, name, email, message }),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    console.error("[contact] Resend error:", res.status, body.message);
    return json({ error: "Failed to send. Please try again." }, 502);
  }

  return json({ ok: true }, 200);
};

// Brand colours mirror --color-brand-navy/teal/yellow in src/styles/global.css.
// Email clients can't read CSS variables, so the hex values are hardcoded
// (same approach as api/apply.ts).
const BRAND_NAVY = "#1A254C";
const BRAND_TEAL = "#0CA99E";
const BRAND_YELLOW = "#F69422";

function buildEmailHtml(fields: {
  heading: string;
  source: string;
  name: string;
  email: string;
  message: string;
}): string {
  const { heading, source, name, email, message } = fields;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #E5E1D8;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND_TEAL};font-family:Helvetica,Arial,sans-serif;">${label}</p>
        <p style="margin:0;font-size:15px;line-height:1.5;color:#1A1A1A;font-family:Helvetica,Arial,sans-serif;">${value}</p>
      </td>
    </tr>`;

  const rows = [
    name ? row("Name", escapeHtml(name)) : "",
    row("Email", escapeHtml(email)),
    message ? row("Message", escapeHtml(message).replace(/\n/g, "<br>")) : "",
  ].join("");

  return `
<div style="background:#F4F1EA;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="background:${BRAND_NAVY};padding:28px 32px;">
        <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND_YELLOW};">MLD Marketing Solutions</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:600;color:#FFFFFF;">${heading}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px 8px;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          ${rows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 28px;">
        <p style="margin:0;font-size:12px;color:#8A8578;">Sent from ${source} at mldmarketing.co.za. Reply to this email to respond directly to the sender.</p>
      </td>
    </tr>
  </table>
</div>`;
}

function str(val: FormDataEntryValue | null): string {
  return typeof val === "string" ? val.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
