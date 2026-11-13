import type { APIRoute } from "astro";
import { env } from "cloudflare:workers"; // CF Workers env access in Astro v6

export const prerender = false; // static output mode, server this route only

// Resend-verified sender domain + MLD's live careers inbox.
const FROM_ADDRESS = "admin@mldmarketing.co.za";
const TO_ADDRESSES = ["michael@mldmarketing.co.za", "lara@mldmarketing.co.za"];

// Keep in sync with MAX_RESUME_BYTES in ApplicationForm.astro - that check is
// a UX shortcut only, this is the real enforcement (client checks are bypassable).
const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    return json({ error: "Email service is not configured." }, 500);
  }

  const formData = await request.formData();
  const role = str(formData.get("role"));
  const name = str(formData.get("name"));
  const email = str(formData.get("email"));
  const portfolio = str(formData.get("portfolio"));
  const message = str(formData.get("message"));
  const trap = str(formData.get("website")); // honeypot

  if (trap.length > 0) return json({ ok: true }, 200); // silent bot bail

  if (!role || !name || !email) {
    return json({ error: "Required fields missing." }, 400);
  }

  const resume = formData.get("resume");
  let attachments: { filename: string; content: string }[] | undefined;

  if (resume instanceof File && resume.size > 0) {
    if (resume.type !== "application/pdf") {
      return json({ error: "CV must be a PDF." }, 400);
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return json({ error: "CV must be under 5MB." }, 400);
    }
    const bytes = new Uint8Array(await resume.arrayBuffer());
    attachments = [{ filename: resume.name || "cv.pdf", content: Buffer.from(bytes).toString("base64") }];
  }

  const html = buildEmailHtml({ role, name, email, portfolio, message, hasResume: !!attachments });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `MLD Careers <${FROM_ADDRESS}>`,
      to: TO_ADDRESSES,
      reply_to: email,
      subject: `Application: ${role} - ${name}`,
      html,
      ...(attachments ? { attachments } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    console.error("[apply] Resend error:", res.status, body.message);
    return json({ error: "Failed to send application." }, 502);
  }

  return json({ ok: true }, 200);
};

// Brand colours mirror --color-brand-navy/teal/yellow in src/styles/global.css.
// Email clients don't load @fontsource or CSS variables, so both the fonts and
// the hex values are hardcoded here rather than shared with the site's theme.
const BRAND_NAVY = "#1A254C";
const BRAND_TEAL = "#0CA99E";
const BRAND_YELLOW = "#F69422";

function buildEmailHtml(fields: {
  role: string;
  name: string;
  email: string;
  portfolio: string;
  message: string;
  hasResume: boolean;
}): string {
  const { role, name, email, portfolio, message, hasResume } = fields;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #E5E1D8;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND_TEAL};font-family:Helvetica,Arial,sans-serif;">${label}</p>
        <p style="margin:0;font-size:15px;line-height:1.5;color:#1A1A1A;font-family:Helvetica,Arial,sans-serif;">${value}</p>
      </td>
    </tr>`;

  const rows = [
    row("Role", escapeHtml(role)),
    row("Name", escapeHtml(name)),
    row("Email", escapeHtml(email)),
    portfolio ? row("Portfolio", escapeHtml(portfolio)) : "",
    hasResume ? row("CV / Resume", "Attached to this email") : "",
    message ? row("Message", escapeHtml(message).replace(/\n/g, "<br>")) : "",
  ].join("");

  return `
<div style="background:#F4F1EA;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="background:${BRAND_NAVY};padding:28px 32px;">
        <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND_YELLOW};">MLD Marketing Solutions</p>
        <p style="margin:6px 0 0;font-size:22px;font-weight:600;color:#FFFFFF;">New Application Received</p>
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
        <p style="margin:0;font-size:12px;color:#8A8578;">Sent from the careers form at mldmarketing.co.za. Reply to this email to respond directly to the applicant.</p>
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
