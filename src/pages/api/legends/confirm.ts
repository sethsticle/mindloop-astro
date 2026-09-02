import type { APIRoute } from "astro";
import { env } from "cloudflare:workers"; // CF Workers env access in Astro v6

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const db = env.DB;
  const token = url.searchParams.get("token");

  if (!db || !token) {
    return redirect("/local-legends?voted=invalid");
  }

  const existing = await db
    .prepare("SELECT status FROM votes WHERE confirm_token = ?")
    .bind(token)
    .first<{ status: string }>();

  if (!existing) {
    return redirect("/local-legends?voted=invalid");
  }

  if (existing.status === "confirmed") {
    return redirect("/local-legends?voted=already");
  }

  await db
    .prepare("UPDATE votes SET status = 'confirmed', confirmed_at = ? WHERE confirm_token = ?")
    .bind(new Date().toISOString(), token)
    .run();

  return redirect("/local-legends?voted=1");
};
