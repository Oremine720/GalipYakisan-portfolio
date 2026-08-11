"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Download, ArrowDown, Mail } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Ambient — one soft glow + faint grid, no particles */}
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-[-12%] h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-[150px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08080a] to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-24 text-center">
        {/* Availability */}
        <motion.div
          {...fadeUp(0)}
          className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs font-medium text-zinc-400"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Staj &amp; iş fırsatlarına açık
        </motion.div>

        {/* Monogram */}
        <motion.div {...fadeUp(0.05)} className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-semibold tracking-tight text-zinc-200 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]">
            GY
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-metal text-5xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-7xl"
        >
          Galip Yakışan
        </motion.h1>

        {/* Role */}
        <motion.p
          {...fadeUp(0.16)}
          className="mt-5 font-mono text-sm tracking-tight text-zinc-500 md:text-base"
        >
          Full&nbsp;Stack Developer
          <span className="mx-2 text-zinc-700">/</span>
          <span className="text-indigo-400">AI Enthusiast</span>
        </motion.p>

        {/* Description */}
        <motion.p
          {...fadeUp(0.22)}
          className="mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-zinc-400 md:text-base"
        >
          C#, React ve yapay zeka teknolojileriyle uçtan uca uygulamalar
          geliştiriyorum. Yazılım mimarisi gerektiren her alanda analitik ve
          kalıcı çözümler üretmeye odaklanıyorum.
        </motion.p>

        {/* Actions */}
        <motion.div
          {...fadeUp(0.28)}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
        >
          <a
            href="mailto:galipyakisan@gmail.com"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-400"
          >
            <Mail size={15} />
            İletişime geç
          </a>
          <a
            href={PERSONAL_INFO.cvUrl}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-white/20 hover:text-white"
          >
            <Download size={15} />
            CV
          </a>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-zinc-300 transition-colors duration-200 hover:border-white/20 hover:text-white"
          >
            <Github size={16} />
          </a>
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-zinc-300 transition-colors duration-200 hover:border-white/20 hover:text-white"
          >
            <Linkedin size={16} />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.36)}
          className="mx-auto mt-14 flex max-w-md items-center justify-center divide-x divide-white/[0.08]"
        >
          {[
            { value: "5+", label: "Proje" },
            { value: "3.76", label: "GPA" },
            { value: "2+", label: "Yıl deneyim" },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 px-6">
              <div className="text-metal text-2xl font-semibold tracking-tight md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        aria-label="Aşağı kaydır"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-700 transition-colors hover:text-zinc-400"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
