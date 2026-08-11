"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle,
  MapPin,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { PERSONAL_INFO } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// EmailJS config — .env.local dosyasından al
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          title: `Portföy mesajı: ${form.name}`,
          time: new Date().toLocaleString("tr-TR"),
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const CONTACT_ITEMS = [
    {
      icon: Mail,
      label: "E-posta",
      value: PERSONAL_INFO.email,
      href: `mailto:${PERSONAL_INFO.email}`,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/Oremine720",
      href: PERSONAL_INFO.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "galip-yakisan",
      href: PERSONAL_INFO.linkedin,
    },
    {
      icon: MapPin,
      label: "Konum",
      value: PERSONAL_INFO.location,
      href: null,
    },
  ];

  /* text-base (16px): iOS Safari, 16px'ten küçük yazı tipli bir alana
     odaklanınca sayfayı otomatik yakınlaştırıp düzeni bozuyor. sm'den
     itibaren tekrar 14px.
     focus:outline-none kaldırıldı: globals.css'teki focus-visible halkasını
     eziyordu ve geriye yalnızca soluk bir kenarlık kalıyordu (WCAG 2.4.7). */
  const inputClass =
    "w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base text-white placeholder-mute-3 transition-colors duration-200 focus:border-indigo-500/60 focus:bg-white/[0.03] sm:text-sm";

  return (
    <section id="contact" className="section-padding relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <span className="overline">07 — İletişim</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Birlikte çalışalım
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute-2">
            Staj, iş teklifi veya freelance proje için bana ulaşabilirsin.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="space-y-3"
          >
            <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm font-medium text-emerald-400">
                  Şu an müsaitim
                </span>
              </div>
              <p className="text-sm leading-relaxed text-mute-2">
                Staj, tam zamanlı pozisyon ve freelance projeler için aktif
                olarak görüşüyorum. En geç 24 saat içinde geri dönerim.
              </p>
            </div>

            {CONTACT_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition-colors duration-200 hover:border-white/[0.16] hover:bg-white/[0.03]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 transition-colors group-hover:text-indigo-400">
                      <item.icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-mute-3">
                        {item.label}
                      </div>
                      <div className="truncate text-sm text-zinc-300 transition-colors group-hover:text-white">
                        {item.value}
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-zinc-700 transition-colors group-hover:text-zinc-400"
                    />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400">
                      <item.icon size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-mute-3">
                        {item.label}
                      </div>
                      <div className="text-sm text-zinc-300">{item.value}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6"
            >
              <div>
                <label htmlFor="contact-name" className="overline mb-2 block">
                  Adın
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Adın Soyadın"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="overline mb-2 block">
                  E-posta
                </label>
                <input
                  id="contact-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="ornek@mail.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="overline mb-2 block">
                  Mesajın
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="Merhaba Galip, seninle konuşmak istiyorum..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Gönderiliyor...
                  </>
                ) : status === "sent" ? (
                  <>
                    <CheckCircle size={16} />
                    Mesaj gönderildi
                  </>
                ) : status === "error" ? (
                  <>
                    <AlertCircle size={16} />
                    Hata — tekrar dene
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Mesaj gönder
                  </>
                )}
              </button>

              {/* Gönderim durumu görsel olarak düğmenin içinde değişiyor;
                  ekran okuyucunun bunu duyurması için canlı bölge gerekiyor. */}
              <p role="status" aria-live="polite" className="sr-only">
                {status === "sending"
                  ? "Mesaj gönderiliyor."
                  : status === "sent"
                    ? "Mesaj gönderildi."
                    : status === "error"
                      ? "Mesaj gönderilemedi, lütfen tekrar dene."
                      : ""}
              </p>

              <p className="text-center text-xs text-mute-3">
                Ya da direkt:{" "}
                <a
                  href="mailto:galipyakisan@gmail.com"
                  className="text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  galipyakisan@gmail.com
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
