"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, MapPin, Calendar, BookOpen } from "lucide-react";
import { EDUCATION } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="education" className="section-padding relative">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <span className="overline">05 — Eğitim</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Akademik geçmiş
          </h2>
        </motion.div>

        <div>
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute bottom-0 left-[22px] top-12 w-px bg-gradient-to-b from-white/15 to-transparent" />

              <div className="flex gap-3 sm:gap-5">
                {/* Node */}
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-indigo-400">
                    <GraduationCap size={18} />
                  </div>
                  {edu.current && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#08080a] bg-emerald-400" />
                  )}
                </div>

                {/* Card */}
                {/* p-6 + 44px düğüm + boşluk, 320px ekranda karta ~160px
                    içerik bırakıyordu; mobilde dolguyu kısıyoruz. */}
                <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-white">
                        {edu.school}
                      </h3>
                      <p className="mt-0.5 text-sm text-indigo-400">
                        {edu.type} — {edu.degree}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {edu.current && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          Devam ediyor
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 font-mono text-xs text-mute-2">
                        <Calendar size={11} />
                        {edu.startDate} — {edu.endDate}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-mute-3" />
                      {edu.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-mute-2">GPA</span>
                      <span className="text-metal font-semibold">{edu.gpa}</span>
                      <span className="text-xs text-mute-3">/ 4.00</span>
                    </span>
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-mute-2">
                    {edu.description}
                  </p>

                  <div>
                    <p className="overline mb-2.5">Ders içerikleri</p>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.courses.map((course) => (
                        <span
                          key={course}
                          className="flex items-center gap-1.5 rounded-md border border-white/[0.07] px-2.5 py-1 text-xs text-zinc-400"
                        >
                          <BookOpen size={10} className="text-mute-3" />
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Future goal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-4 flex gap-3 sm:gap-5"
          >
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-white/10 bg-transparent text-mute-3">
                <GraduationCap size={18} />
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-dashed border-white/10 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Kariyer hedefi
                </span>
                <span className="overline">gelecek</span>
              </div>
              <p className="text-sm leading-relaxed text-mute-2">
                DGS sınavıyla Yazılım Mühendisliği lisans programına geçiş
                yaparak akademik ve profesyonel hedeflerime ulaşmak.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
