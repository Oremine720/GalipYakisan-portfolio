// KPSS erişim kilidi — sunucu tarafı yardımcılar.
//
// Tek kullanıcı (Galip) için basit ama gerçek bir koruma: şifre sunucuda
// (env) tutulur, doğrulanınca httpOnly imzalı bir çerez bırakılır. Şifre ve
// secret asla client bundle'ına girmez (NEXT_PUBLIC_ değiller).
//
// NOT: Bu modül sadece sunucuda çalışır (node:crypto + next/headers). Bir
// client bileşeninden import edilirse build zaten hata verir — istenen koruma.

import crypto from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "kpss_session";

/** Oturum çerezi ömrü: 30 gün. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

/** Env eksikse erişim tamamen kapalı olmalı; bunu tek yerden kontrol edelim. */
export function isConfigured(): boolean {
  return Boolean(process.env.KPSS_PASSWORD && process.env.KPSS_SESSION_SECRET);
}

/**
 * Uzunluk sızıntısı ve timingSafeEqual'in eşit-uzunluk zorunluluğu olmadan
 * sabit-zamanlı karşılaştırma: iki girdiyi de sha256'la, digest'leri karşılaştır.
 */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a, "utf8").digest();
  const hb = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

/**
 * Oturum token'ı: sabit bir yükün KPSS_SESSION_SECRET ile HMAC-SHA256'sı.
 * Deterministik — secret değiştirilince tüm mevcut oturumlar geçersizleşir.
 */
export function sessionToken(): string {
  const secret = process.env.KPSS_SESSION_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update("kpss-authed-v1").digest("hex");
}

/** Girilen şifreyi env'deki şifreyle sabit-zamanlı karşılaştırır. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.KPSS_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

/** İstekteki çerez geçerli bir oturum mu? (server component / route handler) */
export async function isAuthed(): Promise<boolean> {
  if (!isConfigured()) return false;
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}
