"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { scrollToId, scrollToTop } from "@/lib/utils";

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

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  /* Mobil menü: Escape ile kapat, dışarı tıklayınca kapat.
     Escape'te odağı açan düğmeye geri ver — klavye kullanıcısı
     menü kapanınca odağı kaybetmesin. */
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as globalThis.Node;
      if (
        !menuRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollToId(href.replace("#", ""));
  };

  return (
    <>
      <motion.nav
        aria-label="Ana menü"
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
            onClick={scrollToTop}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.12] bg-white/[0.03] text-[11px] font-semibold tracking-tight text-zinc-200 transition-colors group-hover:border-white/25">
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
                  aria-current={active ? "location" : undefined}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
                    active ? "text-white" : "text-mute-2 hover:text-zinc-200"
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
              <GraduationCap size={14} aria-hidden="true" /> KPSS
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="mailto:galipyakisan@gmail.com"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-500"
            >
              İletişim
            </a>
          </div>

          {/* Mobil menü düğmesi — 40px dokunma hedefi (eskiden 32px) */}
          <button
            ref={toggleRef}
            className="-mr-2 flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobil menü */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            /* top: navbar yüksekliği scroll durumuna göre değişiyor; menü
               çubuğun altına oturmalı, üstüne binmemeli (eski top-16 açılışta
               çubukla çakışıyordu).
               max-h + overflow-y: yatay moddaki alçak ekranlarda alt maddeler
               ekran dışına taşıp erişilemez hale gelmesin. */
            className={`fixed inset-x-4 z-[9989] max-h-[calc(100svh-6rem)] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0d0d10]/95 p-3 backdrop-blur-xl md:hidden ${
              scrolled ? "top-[4.25rem]" : "top-[5.25rem]"
            }`}
          >
            {NAV_ITEMS.map((item, i) => {
              const active = activeSection === item.href.replace("#", "");
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={active ? "location" : undefined}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-colors hover:bg-white/5 hover:text-white ${
                    active ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {item.label}
                </motion.button>
              );
            })}
            <Link
              href="/kpss"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-indigo-300 transition-colors hover:bg-white/5"
            >
              <GraduationCap size={15} aria-hidden="true" /> KPSS Çalışma
            </Link>
            <div className="mt-2 border-t border-white/[0.06] pt-2">
              <a
                href="mailto:galipyakisan@gmail.com"
                className="block w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-medium text-white"
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
