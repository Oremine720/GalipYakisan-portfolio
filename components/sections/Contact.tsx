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

// EmailJS config — .env.local dosyasından al
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_name: "Galip",
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
      color: "#6366f1",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/Oremine720",
      href: PERSONAL_INFO.github,
      color: "#f8f8f8",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "galip-yakışan",
      href: PERSONAL_INFO.linkedin,
      color: "#0077B5",
    },
    {
      icon: MapPin,
      label: "Konum",
      value: PERSONAL_INFO.location,
      href: null,
      color: "#f59e0b",
    },
  ];

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-zinc-400 font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            07. iletişim
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            İletişime Geç
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Staj, iş teklifi veya freelance proje için bana ulaşabilirsin.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            <div className="glass rounded-2xl border border-white/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span className="text-green-400 text-sm font-medium">Şu an müsaitim</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Staj fırsatları, tam zamanlı pozisyonlar ve freelance projeler için
                aktif olarak iş görüşmesi yapıyorum. En geç 24 saat içinde geri dönerim.
              </p>
            </div>

            {CONTACT_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 glass glass-hover rounded-xl border border-white/5 group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-zinc-600 mb-0.5">{item.label}</div>
                      <div className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">
                        {item.value}
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0"
                    />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 glass rounded-xl border border-white/5">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-600 mb-0.5">{item.label}</div>
                      <div className="text-sm text-zinc-300">{item.value}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl border border-white/5 p-6 space-y-4"
            >
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-2">
                  {'// adın'}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-2">
                  {'// e-posta'}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-2">
                  {'// mesajın'}
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Merhaba Galip, seninle konuşmak istiyorum..."
                  rows={5}
                  className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all duration-200 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Gönderiliyor...
                  </>
                ) : status === "sent" ? (
                  <>
                    <CheckCircle size={16} />
                    Mesaj Gönderildi!
                  </>
                ) : status === "error" ? (
                  <>
                    <AlertCircle size={16} />
                    Hata! Tekrar dene
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Mesaj Gönder
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-zinc-700">
                Ya da direkt e-posta gönder:{" "}
                <a
                  href="mailto:galipyakisan@gmail.com"
                  className="text-indigo-500 hover:text-indigo-400 transition-colors"
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
