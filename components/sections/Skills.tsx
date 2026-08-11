"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SKILLS, SKILL_CATEGORIES } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered =
    activeCategory === "Tümü"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section-padding relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <span className="overline">02 — Stack</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Teknolojiler
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute-2">
            Projelerimde günlük olarak kullandığım araçlar ve diller.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors duration-200 ${
                activeCategory === cat
                  ? "bg-white text-zinc-900"
                  : "border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, delay: i * 0.02, ease: EASE }}
                /* Mobilde 2 sütunda hücre ~100px içerik genişliği bırakıyor;
                   "ASP.NET Core" + "Backend" yan yana sığmıyordu.
                   Dar ekranda alt alta, sm'den itibaren yan yana. */
                className="group relative flex flex-col items-start gap-0.5 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.015] px-4 py-3.5 transition-colors duration-200 hover:border-white/[0.16] hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-2"
              >
                {/* Left accent that reveals on hover */}
                <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-indigo-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="min-w-0 text-sm font-medium text-zinc-200">
                  {skill.name}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-mute-3">
                  {skill.category}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
