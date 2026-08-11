"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Target, Rocket, Code2, Brain, GraduationCap, MapPin } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "Full Stack Developer",
    desc: "C#, ASP.NET Core ve React ile uçtan uca uygulama geliştirme.",
  },
  {
    icon: Brain,
    title: "AI Enthusiast",
    desc: "Yapay zeka teknolojilerini projelere entegre etme tutkusu.",
  },
  {
    icon: Target,
    title: "Problem Solver",
    desc: "Analitik düşünceyle karmaşık sorunlara kalıcı çözümler.",
  },
  {
    icon: Rocket,
    title: "Kariyer Hedefi",
    desc: "DGS ile Yazılım Mühendisliğine geçiş ve sektörde değer üretme.",
  },
];

const LANGUAGES = [
  { lang: "Türkçe", level: "Ana dil" },
  { lang: "İngilizce", level: "B1 — Orta" },
];

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="section-padding relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <span className="overline">01 — Hakkımda</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Ben kimim?
          </h2>
        </motion.div>

        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-start">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="space-y-5"
          >
            <p className="text-[15px] leading-relaxed text-zinc-300">
              Yazılım geliştirme ve algoritmik problem çözme, profesyonel
              gelişimimin temel odak noktası. Özellikle{" "}
              <span className="text-white">C#, React</span> ve{" "}
              <span className="text-white">yapay zeka teknolojileri</span>{" "}
              ağırlıklı olmak üzere, yazılım mimarisi gerektiren her alanda
              çalışmaya yüksek motivasyon duyuyorum.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-500">
              Karşılaştığım teknik problemlerde kapsamlı kaynak araştırması
              yaparak analitik ve kalıcı çözümler üretmeyi prensip ediniyorum.
            </p>
            <p className="text-[15px] leading-relaxed text-zinc-500">
              Kariyer hedefim; <span className="text-indigo-400">DGS</span> ile
              eğitimimi <span className="text-indigo-400">Yazılım Mühendisliği</span>{" "}
              alanında tamamlayarak sektörde değer üreten yetkin bir Full-Stack
              Developer olmak.
            </p>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: MapPin, text: "Burdur, Türkiye" },
                { icon: GraduationCap, text: "MAKÜ — GPA 3.76" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-1.5 text-sm text-zinc-400"
                >
                  <Icon size={13} className="text-zinc-500" />
                  {text}
                </div>
              ))}
            </div>

            {/* Languages — honest, no fake bars */}
            <div className="pt-3">
              <p className="overline mb-3">Diller</p>
              <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {LANGUAGES.map((l) => (
                  <div
                    key={l.lang}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-sm text-zinc-300">{l.lang}</span>
                    <span className="font-mono text-xs text-zinc-500">
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Highlight cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: EASE }}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 transition-colors duration-200 hover:border-white/[0.16]"
              >
                <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-indigo-400">
                  <item.icon size={17} />
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
