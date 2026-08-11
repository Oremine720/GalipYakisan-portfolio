"use client";

import { motion } from "framer-motion";
import { Timer, ChevronRight, Info } from "lucide-react";
import {
  examSizeOptions,
  questionsBySubject,
  totalQuestionCount,
  subjectName,
} from "@/lib/kpss/data";
import { formatDuration } from "@/lib/kpss/time";
import { EASE, Overline, TopBar } from "./ui";

export default function ExamSetup({
  subjectId,
  onBack,
  onStart,
}: {
  subjectId: string | null;
  onBack: () => void;
  onStart: (size: number) => void;
}) {
  const pool = subjectId
    ? questionsBySubject(subjectId).length
    : totalQuestionCount;
  const sizes = examSizeOptions(subjectId);
  const title = subjectId ? subjectName(subjectId) : "Karışık";

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onBack} title={`Deneme · ${title}`} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Overline>Deneme Boyutu</Overline>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Kaç soruluk deneme?
        </h1>
      </motion.div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-400">
        <Info size={16} className="mt-0.5 shrink-0 text-indigo-400" />
        <p>
          Süre soru başına 1 dakika. Sınav boyunca doğru/yanlış gösterilmez;
          cevaplar en sonda değerlendirilir ve ÖSYM neti (doğru − yanlış/4)
          çıkar.
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {sizes.map((size, i) => (
          <motion.button
            key={size}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 + i * 0.05, ease: EASE }}
            onClick={() => onStart(size)}
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 text-left transition-colors hover:border-white/[0.16] hover:bg-white/[0.028]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/10 font-mono text-sm font-semibold text-indigo-200">
              {size}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">
                {size} soru
              </span>
              <span className="flex items-center gap-1.5 text-sm text-mute-2">
                <Timer size={13} /> {formatDuration(size * 60)}
                {size === pool && (
                  <span className="rounded border border-white/[0.08] px-1.5 py-px font-mono text-[10px] text-zinc-400">
                    tüm havuz
                  </span>
                )}
              </span>
            </span>
            <ChevronRight
              size={18}
              className="shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
