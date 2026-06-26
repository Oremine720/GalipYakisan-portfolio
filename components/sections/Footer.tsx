"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart, ArrowUp, Terminal } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/data";

const FOOTER_LINKS = [
  { label: "GitHub", href: PERSONAL_INFO.github, icon: Github },
  { label: "LinkedIn", href: PERSONAL_INFO.linkedin, icon: Linkedin },
  { label: "E-posta", href: `mailto:${PERSONAL_INFO.email}`, icon: Mail },
];

const NAV_LINKS = [
  { label: "Hakkımda", href: "#about" },
  { label: "Yetenekler", href: "#skills" },
  { label: "Projeler", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Eğitim", href: "#education" },
  { label: "İletişim", href: "#contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 pt-16 pb-8 border-t border-white/5">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060606] to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                G
              </div>
              <span className="text-white font-semibold">
                galip<span className="text-indigo-400">.com</span>
              </span>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">
              Full Stack Developer & AI Enthusiast. Yazılım ile geleceği inşa ediyorum.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-700">
              <Terminal size={12} className="text-indigo-500" />
              <span className="font-mono">console.log(&apos;Merhaba, Dünya!&apos;)</span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-xs text-zinc-600 font-mono mb-4">{'// navigasyon'}</h4>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = link.href.replace("#", "");
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-zinc-500 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs text-zinc-600 font-mono mb-4">{'// bağlantılar'}</h4>
            <div className="space-y-3">
              {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2.5 text-zinc-500 hover:text-white transition-colors duration-200 group text-sm"
                >
                  <Icon size={14} className="text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-zinc-700 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Galip Yakışan. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-1 text-zinc-700 text-xs">
            <span>Next.js & Framer Motion ile yapıldı</span>
            <Heart size={11} className="text-red-500 fill-red-500 mx-1" />
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl glass border border-white/10 text-zinc-500 hover:text-white transition-colors"
            title="Yukarı çık"
          >
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
