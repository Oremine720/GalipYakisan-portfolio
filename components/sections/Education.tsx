"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, MapPin, Calendar, Award, BookOpen } from "lucide-react";
import { EDUCATION } from "@/lib/data";

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="education" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[100px]" />
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
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            05. eğitim
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Eğitim
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Akademik geçmişim ve aldığım eğitimler.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 to-transparent" />

              <div className="flex gap-6">
                {/* Icon */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <GraduationCap size={20} className="text-indigo-400" />
                  </div>
                  {edu.current && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#080808]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 glass rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {edu.school}
                      </h3>
                      <p className="text-indigo-400 text-sm font-medium">
                        {edu.type} — {edu.degree}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {edu.current && (
                        <span className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                          Devam Ediyor
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar size={11} />
                        {edu.startDate} — {edu.endDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <MapPin size={13} className="text-zinc-600" />
                      {edu.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award size={13} className="text-amber-400" />
                      <span className="text-sm font-semibold text-amber-400">GPA: {edu.gpa}</span>
                      <span className="text-xs text-zinc-600">/ 4.00</span>
                    </div>
                  </div>

                  <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                    {edu.description}
                  </p>

                  <div>
                    <p className="text-xs text-zinc-600 font-mono mb-2.5">{'// ders içerikleri'}</p>
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course) => (
                        <span
                          key={course}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/3 border border-white/5 text-zinc-400 text-xs"
                        >
                          <BookOpen size={10} className="text-zinc-600" />
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
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex gap-6"
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 border-dashed flex items-center justify-center">
                <GraduationCap size={20} className="text-purple-400 opacity-50" />
              </div>
            </div>
            <div className="flex-1 glass rounded-2xl border border-purple-500/10 border-dashed p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-400 text-sm font-semibold">Kariyer Hedefi</span>
                <span className="px-2 py-0.5 rounded text-[10px] text-purple-400/60 bg-purple-500/10 font-mono">
                  gelecek
                </span>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                DGS sınavı aracılığıyla Yazılım Mühendisliği lisans programına geçiş yaparak
                akademik ve profesyonel hedeflerime ulaşmak.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
