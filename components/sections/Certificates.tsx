"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, ExternalLink, CheckCircle } from "lucide-react";
import { CERTIFICATES } from "@/lib/data";

export default function Certificates() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certificates" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-zinc-400 font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            06. sertifikalar
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sertifikalar
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Tamamladığım eğitimler ve kazandığım sertifikalar.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {CERTIFICATES.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass glass-hover rounded-2xl border border-white/5 p-6 group relative overflow-hidden"
            >
              {/* BG glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: cert.color }}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cert.color}20` }}
                >
                  {cert.icon}
                </div>

                {/* Verified badge */}
                <div className="absolute top-0 right-0">
                  <CheckCircle size={16} className="text-green-400" />
                </div>

                <h3 className="text-sm font-semibold text-white mb-1.5 leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs text-zinc-500 mb-3">{cert.issuer}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Award size={12} style={{ color: cert.color }} />
                    <span className="text-xs font-mono" style={{ color: cert.color }}>
                      {cert.date}
                    </span>
                  </div>
                  <a
                    href={cert.credentialUrl}
                    className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Görüntüle <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
