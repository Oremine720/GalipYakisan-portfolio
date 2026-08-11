"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, ExternalLink, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const displayed =
    filter === "featured" ? PROJECTS.filter((p) => p.featured) : PROJECTS;

  return (
    <section id="projects" className="section-padding relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <span className="overline">03 — İşler</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Seçili projeler
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute-2">
              Geliştirdiğim uygulamalar ve yazılım projeleri.
            </p>
          </div>

          {/* Filter */}
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 p-1">
            {[
              { label: "Tümü", value: "all" },
              { label: "Öne çıkanlar", value: "featured" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                aria-pressed={filter === f.value}
                className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors duration-200 ${
                  filter === f.value
                    ? "bg-white text-zinc-900"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {displayed.map((project, i) => {
              const done = project.status === "Completed";
              return (
                <motion.a
                  key={project.id}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                  className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.028]"
                >
                  {/* Top meta */}
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-xs text-mute-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3">
                      {project.featured && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-400">
                          Öne çıkan
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-mute-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            done ? "bg-emerald-400/80" : "bg-amber-400/80"
                          }`}
                        />
                        {done ? "Tamamlandı" : "Geliştiriliyor"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-indigo-300">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-mute-2">{project.subtitle}</p>

                  {/* Description */}
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-mute-2">
                    {project.description}
                  </p>

                  {/* Tech */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/[0.07] px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center gap-4 border-t border-white/[0.06] pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-mute-2 transition-colors group-hover:text-white">
                      <Github size={13} />
                      Kaynak kodu
                    </span>
                    {project.demo && (
                      <span className="flex items-center gap-1.5 text-xs text-indigo-400">
                        <ExternalLink size={13} />
                        Demo
                      </span>
                    )}
                    <ArrowUpRight
                      size={15}
                      className="ml-auto text-zinc-700 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-400"
                    />
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-8"
        >
          <a
            href="https://github.com/Oremine720"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <Github size={15} />
            GitHub&apos;da tüm projeleri gör
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
