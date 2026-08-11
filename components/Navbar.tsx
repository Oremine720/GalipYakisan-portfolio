"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";

const NAV_ITEMS = [
  { label: "Hakkımda", href: "#about" },
  { label: "Yetenekler", href: "#skills" },
  { label: "Projeler", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Eğitim", href: "#education" },
  { label: "İletişim", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[9990] transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#08080a]/80 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/12 bg-white/[0.03] text-[11px] font-semibold tracking-tight text-zinc-200 transition-colors group-hover:border-white/25">
              GY
            </span>
            <span className="text-sm font-medium tracking-tight text-zinc-200">
              Galip Yakışan
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
                    active
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <Link
              href="/kpss"
              className="ml-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-indigo-300 transition-colors duration-200 hover:text-indigo-200"
            >
              <GraduationCap size={14} /> KPSS
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="mailto:galipyakisan@gmail.com"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-400"
            >
              İletişim
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="p-1.5 text-zinc-400 transition-colors hover:text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-16 z-[9989] rounded-2xl border border-white/[0.08] bg-[#0d0d10]/95 p-3 backdrop-blur-xl md:hidden"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleNavClick(item.href)}
                className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </motion.button>
            ))}
            <Link
              href="/kpss"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-indigo-300 transition-colors hover:bg-white/5"
            >
              <GraduationCap size={15} /> KPSS Çalışma
            </Link>
            <div className="mt-2 border-t border-white/[0.06] pt-2">
              <a
                href="mailto:galipyakisan@gmail.com"
                className="block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-medium text-white"
              >
                İletişime geç
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
