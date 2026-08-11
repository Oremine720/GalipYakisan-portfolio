"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sitenin genelinde kullanılan yumuşak giriş eğrisi. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Overline({ children }: { children: React.ReactNode }) {
  return <span className="overline">{children}</span>;
}

/**
 * Soru gövdesi / çözüm metnini render eder.
 * `**kalın**` işaretlemesini <strong>'a çevirir, satır sonlarını ve
 * girintileri (whitespace-pre-wrap ile) olduğu gibi korur.
 */
export function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split("**");
  return (
    <span className={cn("whitespace-pre-wrap break-words", className)}>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-zinc-100">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
}

/** Dersin tohum rengine göre yumuşak dolgu/kenarlık stili (rozetler için). */
export function subjectTint(colorSeed?: string): React.CSSProperties {
  const c = colorSeed || "#6366f1";
  return {
    backgroundColor: `${c}1f`,
    borderColor: `${c}66`,
  };
}

/** Dersin baş harfini renkli bir kare rozette gösterir. */
export function SubjectBadge({
  name,
  colorSeed,
  size = 40,
}: {
  name: string;
  colorSeed?: string;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl border text-sm font-semibold text-zinc-100"
      style={{ ...subjectTint(colorSeed), width: size, height: size }}
    >
      {name.charAt(0)}
    </span>
  );
}

/** Sabit üst çubuk: geri (opsiyonel) + KPSS marka + "siteye dön". */
export function TopBar({
  onBack,
  title,
}: {
  onBack?: () => void;
  title?: string;
}) {
  return (
    <div className="sticky top-0 z-40 -mx-6 mb-8 border-b border-white/[0.06] bg-[#08080a]/85 px-6 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          {onBack ? (
            <button
              onClick={onBack}
              className="-ml-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} /> Geri
            </button>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <GraduationCap size={17} className="text-indigo-400" /> KPSS
            </span>
          )}
          {title && (
            <span className="truncate text-sm text-zinc-500">· {title}</span>
          )}
        </div>
        <Link
          href="/"
          className="shrink-0 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
        >
          ← Siteye dön
        </Link>
      </div>
    </div>
  );
}
