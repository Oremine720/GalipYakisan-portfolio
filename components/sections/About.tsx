"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Target, Rocket, Code2, Brain, GraduationCap, MapPin } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "Full Stack Developer",
    desc: "C#, ASP.NET Core ve React ile end-to-end uygulama geliştirme",
    color: "#6366f1",
  },
  {
    icon: Brain,
    title: "AI Enthusiast",
    desc: "Yapay zeka teknolojilerini projelere entegre etme tutkusu",
    color: "#8b5cf6",
  },
  {
    icon: Target,
    title: "Problem Solver",
    desc: "Analitik düşünce ile karmaşık sorunlara kalıcı çözümler",
    color: "#06b6d4",
  },
  {
    icon: Rocket,
    title: "Kariyer Hedefi",
    desc: "DGS ile Yazılım Mühendisliğine geçiş ve sektörde değer yaratma",
    color: "#f59e0b",
  },
];

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-zinc-400 font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            01. hakkımda
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ben Kimim?
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Kod yazan, problem çözen ve teknolojiye tutkuyla bağlı bir geliştirici.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-zinc-300 leading-relaxed text-base">
                Yazılım geliştirme ve algoritmik problem çözme süreçleri, profesyonel gelişimimin
                temel odak noktasını oluşturmaktadır. Özellikle{" "}
                <span className="text-indigo-400 font-medium">C#, React</span> ve{" "}
                <span className="text-indigo-400 font-medium">yapay zeka teknolojileri</span>{" "}
                ağırlıklı olmak üzere, yazılım mimarisi gerektiren her alanda çalışmaya yüksek
                motivasyon duyuyorum.
              </p>
              <p className="text-zinc-400 leading-relaxed text-base">
                Geliştirme süreçlerinde karşılaştığım teknik problemlerde, kapsamlı kaynak
                araştırması yaparak analitik ve kalıcı çözümler üretmeyi prensip ediniyorum.
              </p>
              <p className="text-zinc-400 leading-relaxed text-base">
                Temel kariyer hedefim;{" "}
                <span className="text-purple-400 font-medium">DGS</span> ile eğitimimi{" "}
                <span className="text-purple-400 font-medium">Yazılım Mühendisliği</span>{" "}
                alanında tamamlayarak, sektörde değer üreten yetkin bir Full-Stack Developer
                olmaktır.
              </p>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: MapPin, text: "Burdur, Türkiye" },
                { icon: GraduationCap, text: "MAKÜ — GPA: 3.76" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/5 text-sm text-zinc-400"
                >
                  <Icon size={13} className="text-indigo-400" />
                  {text}
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="pt-2">
              <p className="text-xs text-zinc-600 font-mono mb-2">{'// diller'}</p>
              <div className="flex gap-3">
                {[
                  { lang: "Türkçe", level: "Ana Dil", pct: 100 },
                  { lang: "İngilizce", level: "B1", pct: 55 },
                ].map((l) => (
                  <div key={l.lang} className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-300">{l.lang}</span>
                      <span className="text-zinc-600">{l.level}</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${l.pct}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Highlight cards */}
          <div className="grid grid-cols-2 gap-4">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass glass-hover rounded-2xl p-5 border border-white/5 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
