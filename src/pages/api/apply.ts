import type { APIRoute } from "astro";
import { env } from "cloudflare:workers"; // CF Workers env access in Astro v6

export const prerender = false; // static output mode, server this route only

// CONFIGURE: must be a Resend-verified sender domain, and MLD's real inbox.
const FROM_ADDRESS = "admin@mldmarketing.co.za";
// const TO_ADDRESS = "michael@mldmarketing.co.za";
const TO_ADDRESS = "seth.hendrikz@gmail.com";

// Keep in sync with MAX_RESUME_BYTES in ApplicationForm.astro — that check is
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

  const html = `
    <p><strong>Role:</strong> ${escapeHtml(role)}</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${portfolio ? `<p><strong>Portfolio:</strong> ${escapeHtml(portfolio)}</p>` : ""}
    ${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `MLD Careers <${FROM_ADDRESS}>`,
      to: [TO_ADDRESS],
      reply_to: email,
      subject: `Application: ${role} — ${name}`,
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
