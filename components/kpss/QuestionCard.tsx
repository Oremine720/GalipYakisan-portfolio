"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Star, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/kpss/types";
import { subjectById, subjectName, subTopicName } from "@/lib/kpss/data";
import { isFavorite, toggleFavorite } from "@/lib/kpss/storage";
import { EASE, RichText, SubjectBadge } from "./ui";

const DIFF: Record<string, { label: string; cls: string }> = {
  KOLAY: { label: "Kolay", cls: "border-emerald-400/25 text-emerald-300" },
  ORTA: { label: "Orta", cls: "border-amber-400/25 text-amber-300" },
  ZOR: { label: "Zor", cls: "border-rose-400/25 text-rose-300" },
};

/** Kendi durumunu localStorage'dan yöneten yıldız (favori) düğmesi. */
export function FavoriteButton({ questionId }: { questionId: string }) {
  const [fav, setFav] = useState(false);
  useEffect(() => setFav(isFavorite(questionId)), [questionId]);
  return (
    <button
      onClick={() => setFav(toggleFavorite(questionId))}
      aria-label={fav ? "Favoriden çıkar" : "Favorile"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
        fav
          ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
          : "border-white/[0.08] text-zinc-500 hover:text-zinc-200",
      )}
    >
      <Star size={16} className={fav ? "fill-amber-300" : ""} />
    </button>
  );
}

type OptState = "idle" | "selected" | "correct" | "wrong" | "muted";

export default function QuestionCard({
  question,
  selectedIndex,
  revealed,
  onSelect,
  showHint = false,
}: {
  question: Question;
  selectedIndex: number | null;
  /** true => doğru/yanlış + çözüm açık (çalışma modu / sonuç incelemesi). */
  revealed: boolean;
  onSelect: (index: number) => void;
  showHint?: boolean;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const diff = DIFF[question.difficulty] ?? DIFF.ORTA;
  const colorSeed = subjectById(question.subjectId)?.colorSeed;

  useEffect(() => setHintOpen(false), [question.id]);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 sm:p-6"
    >
      {/* Meta */}
      <div className="mb-4 flex items-center gap-3">
        <SubjectBadge
          name={subjectName(question.subjectId)}
          colorSeed={colorSeed}
          size={36}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-zinc-200">
            {subjectName(question.subjectId)}
          </div>
          <div className="truncate text-xs text-zinc-500">
            {subTopicName(question.subTopicId)}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            diff.cls,
          )}
        >
          {diff.label}
        </span>
        <FavoriteButton questionId={question.id} />
      </div>

      {/* Paragraf metni (varsa) */}
      {question.passage && (
        <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-400">
          <RichText text={question.passage} />
        </div>
      )}

      {/* Soru gövdesi */}
      <div className="text-[15px] font-medium leading-relaxed text-zinc-100 sm:text-base">
        <RichText text={question.stem} />
      </div>

      {/* İpucu (çalışma modu, cevaptan önce) */}
      {showHint && !revealed && (
        <div className="mt-4">
          {hintOpen ? (
            <div className="flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-sm leading-relaxed text-amber-200/90">
              <Lightbulb size={15} className="mt-0.5 shrink-0" />
              <RichText text={question.hint} />
            </div>
          ) : (
            <button
              onClick={() => setHintOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-amber-300"
            >
              <Lightbulb size={13} /> İpucu göster
            </button>
          )}
        </div>
      )}

      {/* Şıklar */}
      <div className="mt-5 grid gap-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = idx === question.correctIndex;
          let state: OptState = "idle";
          if (revealed) {
            state = isCorrect ? "correct" : isSelected ? "wrong" : "muted";
          } else if (isSelected) {
            state = "selected";
          }
          return (
            <button
              key={opt.label}
              disabled={revealed}
              onClick={() => onSelect(idx)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors",
                state === "idle" &&
                  "border-white/[0.08] bg-white/[0.01] hover:border-white/[0.18] hover:bg-white/[0.03]",
                state === "selected" && "border-indigo-400/50 bg-indigo-500/10",
                state === "correct" && "border-emerald-400/40 bg-emerald-500/10",
                state === "wrong" && "border-rose-400/40 bg-rose-500/10",
                state === "muted" && "border-white/[0.05] bg-white/[0.01] opacity-55",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-semibold",
                  state === "correct" &&
                    "border-emerald-400/50 bg-emerald-500/20 text-emerald-200",
                  state === "wrong" &&
                    "border-rose-400/50 bg-rose-500/20 text-rose-200",
                  state === "selected" &&
                    "border-indigo-400/50 bg-indigo-500/20 text-indigo-200",
                  (state === "idle" || state === "muted") &&
                    "border-white/15 text-zinc-300",
                )}
              >
                {state === "correct" ? (
                  <Check size={14} />
                ) : state === "wrong" ? (
                  <X size={14} />
                ) : (
                  opt.label
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-relaxed text-zinc-200">
                  <RichText text={opt.text} />
                </span>
                {revealed && (isSelected || isCorrect) && opt.explanation && (
                  <span
                    className={cn(
                      "mt-1.5 block text-xs leading-relaxed",
                      isCorrect ? "text-emerald-200/70" : "text-rose-200/70",
                    )}
                  >
                    <RichText text={opt.explanation} />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Çözüm + öğrenme notu (revealed) */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-5 space-y-4 border-t border-white/[0.06] pt-5"
        >
          <div>
            <div className="overline mb-1.5">Çözüm</div>
            <RichText
              text={question.solution}
              className="text-sm leading-relaxed text-zinc-300"
            />
          </div>
          {question.learningNote && (
            <div>
              <div className="overline mb-1.5">Öğrenme Notu</div>
              <RichText
                text={question.learningNote}
                className="text-sm leading-relaxed text-zinc-400"
              />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
