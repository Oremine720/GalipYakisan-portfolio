"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, ArrowDown, Terminal } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/data";

interface Particle {
  left: string;
  top: string;
  duration: number;
  delay: number;
}

export default function Hero() {
  // Particle pozisyonları sadece client'ta üretilir (hydration uyumu için)
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/5 rounded-full blur-[150px]" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-indigo-400/20"
          style={{
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/20 text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-green-400 font-medium">Staj & İş Fırsatlarına Açık</span>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="relative mb-8"
          >
            <div className="relative w-28 h-28 md:w-36 md:h-36">
              {/* Animated ring */}
              <motion.div
                className="absolute -inset-1 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)",
                  backgroundSize: "300%",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-5xl md:text-6xl font-bold text-white overflow-hidden border-2 border-indigo-500/30 glass">
                GY
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
          >
            <span className="text-white">Galip </span>
            <span className="gradient-text">Yakışan</span>
          </motion.h1>

          {/* Animated subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 mb-6"
          >
            <Terminal size={16} className="text-indigo-400" />
            <span className="text-lg md:text-xl text-zinc-300 font-mono">
              Full Stack Developer{" "}
              <span className="text-indigo-400 animate-pulse">_</span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl text-zinc-400 text-base md:text-lg leading-relaxed mb-10"
          >
            C#, React ve yapay zeka teknolojileri ile{" "}
            <span className="text-zinc-200">etkileyici dijital deneyimler</span>{" "}
            inşa ediyorum. Yazılım mimarisi gerektiren her alanda{" "}
            <span className="text-zinc-200">analitik ve kalıcı çözümler</span> üretiyorum.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <motion.a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass glass-hover text-white text-sm font-medium border border-white/10"
            >
              <Github size={16} />
              GitHub
            </motion.a>

            <motion.a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0077B5]/20 hover:bg-[#0077B5]/30 text-[#0077B5] border border-[#0077B5]/30 text-sm font-medium transition-all duration-200"
            >
              <Linkedin size={16} />
              LinkedIn
            </motion.a>

            <motion.a
              href={PERSONAL_INFO.cvUrl}
              download
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-600/30"
            >
              <Download size={16} />
              CV İndir
            </motion.a>

            <motion.a
              href="mailto:galipyakisan@gmail.com"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-600/20"
            >
              <Mail size={16} />
              İletişim
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-8 mb-16"
          >
            {[
              { value: "5+", label: "Proje" },
              { value: "3.76", label: "GPA" },
              { value: "2+", label: "Yıl Deneyim" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToAbout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors group"
          >
            <span className="text-xs font-mono">scroll down</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown size={16} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
