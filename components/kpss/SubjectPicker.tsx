"use client";

import { motion } from "framer-motion";
import { Shuffle, ChevronRight } from "lucide-react";
import { EASE, Overline, SubjectBadge, TopBar } from "./ui";
import { subjects, questionsBySubject, totalQuestionCount } from "@/lib/kpss/data";

type Mode = "study" | "exam";

export default function SubjectPicker({
  mode,
  onBack,
  onChoose,
}: {
  mode: Mode;
  onBack: () => void;
  /** subjectId; null => tüm dersler (karışık). */
  onChoose: (subjectId: string | null) => void;
}) {
  const label = mode === "study" ? "Çalışma" : "Deneme";

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onBack} title={label} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Overline>Ders Seç</Overline>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Hangi derse çalışacaksın?
        </h2>
      </motion.div>

      {/* Tüm dersler */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
        onClick={() => onChoose(null)}
        className="group mt-6 flex w-full items-center gap-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-5 text-left transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/[0.1]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/10 text-indigo-300">
          <Shuffle size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-white">
            Tüm dersler · karışık
          </span>
          <span className="block text-sm text-zinc-400">
            Havuzdaki her dersten karışık sorular
          </span>
        </span>
        <span className="shrink-0 font-mono text-xs text-zinc-500">
          {totalQuestionCount} soru
        </span>
        <ChevronRight
          size={18}
          className="shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400"
        />
      </motion.button>

      {/* Dersler */}
      <div className="mt-4 grid gap-3">
        {subjects.map((subject, i) => {
          const count = questionsBySubject(subject.id).length;
          const disabled = count === 0;
          return (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.05, ease: EASE }}
              disabled={disabled}
              onClick={() => !disabled && onChoose(subject.id)}
              className={
                disabled
                  ? "flex w-full cursor-not-allowed items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 text-left opacity-50"
                  : "group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4 text-left transition-colors hover:border-white/[0.16] hover:bg-white/[0.028]"
              }
            >
              <SubjectBadge name={subject.name} colorSeed={subject.colorSeed} />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-zinc-100">
                  {subject.name}
                </span>
                <span className="block text-xs text-zinc-500">
                  {subject.topics?.length ?? 0} konu
                </span>
              </span>
              {disabled ? (
                <span className="shrink-0 rounded-md border border-white/[0.07] px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                  yakında
                </span>
              ) : (
                <>
                  <span className="shrink-0 font-mono text-xs text-zinc-500">
                    {count} soru
                  </span>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400"
                  />
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
