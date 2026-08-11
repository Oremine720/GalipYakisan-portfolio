import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE,
  isConfigured,
  sessionToken,
  verifyPassword,
} from "@/lib/kpss/auth";

// node:crypto kullandığımız için Node runtime (Edge değil).
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Sunucu yapılandırılmamış (KPSS_PASSWORD / KPSS_SESSION_SECRET eksik)." },
      { status: 500 },
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  if (!verifyPassword(password)) {
    // Brute-force'u biraz yavaşlat.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "Şifre yanlış." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
