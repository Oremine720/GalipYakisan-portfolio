"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, ExternalLink, ArrowUpRight, Star } from "lucide-react";
import { PROJECTS } from "@/lib/data";

export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const displayed = filter === "featured"
    ? PROJECTS.filter((p) => p.featured)
    : PROJECTS;

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
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
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            03. projeler
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Projelerim
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Geliştirdiğim uygulamalar ve yazılım projeleri.
          </p>

          {/* Filter */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl glass border border-white/5">
            {[
              { label: "Tümü", value: "all" },
              { label: "Öne Çıkanlar", value: "featured" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === f.value
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayed.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative glass rounded-2xl border border-white/5 overflow-hidden"
              >
                {/* Gradient header */}
                <div className={`relative h-40 bg-gradient-to-br ${project.gradient} opacity-80`}>
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    {project.icon}
                  </div>
                  {/* Shimmer */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className="px-2 py-1 rounded-md text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${project.statusColor}20`,
                        color: project.statusColor,
                        border: `1px solid ${project.statusColor}40`,
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                  {/* Featured star */}
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-1">
                    <span className="text-[10px] font-mono text-zinc-600">{project.year}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-indigo-400 mb-3">{project.subtitle}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[10px] font-mono border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                    >
                      <Github size={13} />
                      Kaynak Kodu
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <ExternalLink size={13} />
                        Demo
                      </a>
                    )}
                    <div className="ml-auto">
                      <ArrowUpRight
                        size={14}
                        className="text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/Oremine720"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover border border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all duration-200"
          >
            <Github size={16} />
            GitHub&apos;da Daha Fazlasını Gör
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
