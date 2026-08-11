"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Timer,
  Star,
  BarChart3,
  ChevronRight,
  GraduationCap,
  Lock,
} from "lucide-react";
import { EASE, Overline } from "./ui";
import { totalQuestionCount, subjectsWithCounts } from "@/lib/kpss/data";

type Mode = "study" | "exam";

export default function KpssHome({
  onPick,
  onFavorites,
  onStats,
}: {
  onPick: (mode: Mode) => void;
  onFavorites: () => void;
  onStats: () => void;
}) {
  const subjects = subjectsWithCounts();
  const router = useRouter();

  async function handleLock() {
    try {
      await fetch("/api/kpss/logout", { method: "POST" });
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Başlık */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="pt-6"
      >
        <div className="flex items-center justify-between">
          <Overline>KPSS ÖN LİSANS</Overline>
          <button
            onClick={handleLock}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] text-zinc-500 transition-colors hover:border-white/[0.16] hover:text-zinc-300"
          >
            <Lock size={12} /> Kilitle
          </button>
        </div>
        <h1 className="mt-3 flex items-center gap-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          <GraduationCap className="text-indigo-400" size={32} />
          Çalışma &amp; Deneme
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-zinc-500">
          Konuya göre soru çöz, süreli deneme yap, ÖSYM netini gör. Otobüste bile
          telefondan girip çalışabilirsin.
        </p>
      </motion.header>

      {/* Mod kartları */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <ModeCard
          index={0}
          onClick={() => onPick("study")}
          icon={<BookOpen size={22} />}
          title="Çalışma Modu"
          desc="Şıkkı işaretle, anında doğru/yanlış ile açıklamayı ve adım adım çözümü gör."
          tag="Anlık geri bildirim"
        />
        <ModeCard
          index={1}
          onClick={() => onPick("exam")}
          icon={<Timer size={22} />}
          title="Sınav Modu"
          desc="Süreli deneme. Cevaplar sonunda değerlendirilir; net ve ders kırılımı çıkar."
          tag="Süreli · ÖSYM neti"
        />
      </div>

      {/* Hızlı erişim */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <QuickCard
          index={2}
          onClick={onFavorites}
          icon={<Star size={18} />}
          title="Favoriler"
          desc="Yıldızladığın soruları tekrar çöz."
        />
        <QuickCard
          index={3}
          onClick={onStats}
          icon={<BarChart3 size={18} />}
          title="İstatistik"
          desc="İlerlemen ve ders bazlı doğru oranın."
        />
      </div>

      {/* Havuz durumu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
        className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5"
      >
        <div className="flex items-center justify-between">
          <span className="overline">Soru Havuzu</span>
          <span className="font-mono text-xs text-zinc-500">
            {totalQuestionCount} soru
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {subjects.map(({ subject, count }) => (
            <span
              key={subject.id}
              className="rounded-md border border-white/[0.07] px-2 py-0.5 font-mono text-[10px] text-zinc-400"
            >
              {subject.name} · {count}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-600">
          Havuz şimdilik küçük; JSON&apos;a soru eklendikçe büyür ve daha büyük
          denemeler otomatik açılır.
        </p>
      </motion.div>
    </div>
  );
}

function ModeCard({
  index,
  onClick,
  icon,
  title,
  desc,
  tag,
}: {
  index: number;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease: EASE }}
      onClick={onClick}
      className="group flex flex-col items-start rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 text-left transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.028]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/10 text-indigo-300 transition-colors group-hover:border-indigo-400/40">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-indigo-300">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{desc}</p>
      <span className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {tag}
        <ChevronRight
          size={13}
          className="text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400"
        />
      </span>
    </motion.button>
  );
}

function QuickCard({
  index,
  onClick,
  icon,
  title,
  desc,
}: {
  index: number;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease: EASE }}
      onClick={onClick}
      className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 text-left transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.028]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-zinc-200 group-hover:text-white">
          {title}
        </span>
        <span className="block truncate text-xs text-zinc-500">{desc}</span>
      </span>
      <ChevronRight
        size={16}
        className="ml-auto shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400"
      />
    </motion.button>
  );
}
