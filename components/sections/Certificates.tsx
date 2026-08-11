"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, ExternalLink, CheckCircle } from "lucide-react";
import { CERTIFICATES } from "@/lib/data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Certificates() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="certificates" className="section-padding relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10"
        >
          <span className="overline">06 — Sertifikalar</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Eğitimler &amp; sertifikalar
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 transition-colors duration-200 hover:border-white/[0.16]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-indigo-400">
                  <Award size={17} />
                </div>
                <CheckCircle size={15} className="text-emerald-400/70" />
              </div>

              <h3 className="text-sm font-semibold leading-snug text-white">
                {cert.title}
              </h3>
              <p className="mt-1 text-xs text-mute-2">{cert.issuer}</p>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                <span className="font-mono text-xs text-mute-2">{cert.date}</span>
                {cert.credentialUrl && cert.credentialUrl !== "#" && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-mute-2 transition-colors hover:text-white"
                  >
                    Görüntüle <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
