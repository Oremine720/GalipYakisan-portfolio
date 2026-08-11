"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Loader2, ArrowRight, GraduationCap } from "lucide-react";
import { EASE, Overline } from "./ui";

export default function KpssGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kpss/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        // Sunucu sayfası yeniden render olur; artık authed → KpssApp açılır.
        setPassword("");
        router.refresh();
        return;
      }
      setError(data.error ?? "Giriş başarısız.");
      setLoading(false);
    } catch {
      setError("Bağlantı hatası. Tekrar dene.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/10 text-indigo-300">
            <Lock size={22} />
          </span>

          <div className="mt-5">
            <Overline>ÖZEL ALAN</Overline>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
              <GraduationCap size={22} className="text-indigo-400" />
              KPSS Çalışma
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Bu alan yalnızca sana özel. Devam etmek için şifreni gir.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6">
            <label htmlFor="kpss-pw" className="sr-only">
              Şifre
            </label>
            <input
              id="kpss-pw"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Şifre"
              className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-indigo-400/50"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-rose-400"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Kontrol ediliyor…
                </>
              ) : (
                <>
                  Giriş yap <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-200"
          >
            ← Siteye dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
