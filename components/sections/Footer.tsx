"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
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
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative z-10 border-t border-white/[0.06] pb-8 pt-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/12 bg-white/[0.03] text-[11px] font-semibold tracking-tight text-zinc-200">
                GY
              </span>
              <span className="text-sm font-medium tracking-tight text-zinc-200">
                Galip Yakışan
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Full Stack Developer &amp; AI Enthusiast. Yazılımla değer üreten
              çözümler geliştiriyorum.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="overline mb-4">Navigasyon</p>
            <div className="grid grid-cols-2 gap-y-2.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(link.href.replace("#", ""))
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="overline mb-4">Bağlantılar</p>
            <div className="space-y-3">
              {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-2.5 text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
                >
                  <Icon
                    size={14}
                    className="text-zinc-600 transition-colors group-hover:text-indigo-400"
                  />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Galip Yakışan
          </p>
          <p className="font-mono text-xs text-zinc-700">
            Next.js &amp; Tailwind ile inşa edildi
          </p>
          <button
            onClick={scrollToTop}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 transition-colors hover:border-white/20 hover:text-white"
            aria-label="Yukarı çık"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
