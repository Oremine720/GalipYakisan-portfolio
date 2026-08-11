"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Timer, ChevronLeft, ChevronRight, Flag, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { pickQuestions, subjectName } from "@/lib/kpss/data";
import { formatClock } from "@/lib/kpss/time";
import type { FinishedSession } from "@/lib/kpss/session";
import { EASE, TopBar } from "./ui";
import QuestionCard from "./QuestionCard";

export default function ExamRunner({
  subjectId,
  size,
  onExit,
  onFinish,
}: {
  subjectId: string | null;
  size: number;
  onExit: () => void;
  onFinish: (s: FinishedSession) => void;
}) {
  const questions = useMemo(
    () => pickQuestions({ subjectId, count: size }),
    [subjectId, size],
  );
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confirming, setConfirming] = useState(false);

  const answersRef = useRef<Record<string, number>>({});
  const startRef = useRef<number>(Date.now());
  const finishedRef = useRef(false);
  const durationSec = questions.length * 60;
  const [remaining, setRemaining] = useState(durationSec);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    onFinish({
      mode: "exam",
      subjectId,
      questions,
      answers: answersRef.current,
      startedAtISO: new Date(startRef.current).toISOString(),
      durationSec: Math.min(durationSec, elapsed),
    });
  }, [onFinish, subjectId, questions, durationSec]);

  // Saniye sayacı
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  // Süre bitince otomatik değerlendir
  useEffect(() => {
    if (remaining === 0) finish();
  }, [remaining, finish]);

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <TopBar onBack={onExit} title="Deneme" />
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-10 text-center text-sm text-zinc-400">
          Bu derste deneme başlatacak kadar soru yok.
        </div>
      </div>
    );
  }

  const q = questions[i];
  const selected = answers[q.id] ?? null;
  const answeredCount = Object.keys(answers).length;
  const blankCount = questions.length - answeredCount;
  const lowTime = remaining <= 60;

  function choose(idx: number) {
    setAnswers((prev) => {
      const next = { ...prev };
      if (next[q.id] === idx) delete next[q.id]; // aynı şıkka tekrar basınca boşalt
      else next[q.id] = idx;
      answersRef.current = next;
      return next;
    });
  }

  function goto(idx: number) {
    setI(idx);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onExit} title={`Deneme · ${subjectId ? subjectName(subjectId) : "Karışık"}`} />

      {/* Sayaç + ilerleme */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
            lowTime
              ? "animate-pulse border-rose-400/40 bg-rose-500/10 text-rose-300"
              : "border-white/[0.08] bg-white/[0.02] text-zinc-200",
          )}
        >
          <Timer size={15} /> {formatClock(remaining)}
        </span>
        <span className="text-xs text-zinc-500">
          <span className="font-mono text-zinc-300">{answeredCount}</span>/
          {questions.length} cevaplandı
        </span>
      </div>

      {/* Soru paleti */}
      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
        {questions.map((qq, idx) => {
          const isAnswered = answers[qq.id] !== undefined;
          const current = idx === i;
          return (
            <button
              key={qq.id}
              onClick={() => goto(idx)}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border font-mono text-xs transition-colors",
                current
                  ? "border-indigo-400 bg-indigo-500/20 text-white"
                  : isAnswered
                    ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-200"
                    : "border-white/10 text-zinc-500 hover:text-zinc-300",
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Soru (geri bildirim gizli) */}
      <QuestionCard
        question={q}
        selectedIndex={selected}
        revealed={false}
        onSelect={choose}
      />

      {/* Gezinme + bitir */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => goto(i - 1)}
          disabled={i === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm text-zinc-300 transition-colors enabled:hover:border-white/20 enabled:hover:text-white disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Önceki
        </button>

        {i === questions.length - 1 ? (
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            <Flag size={16} /> Bitir
          </button>
        ) : (
          <button
            onClick={() => goto(i + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
          >
            Sonraki <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* "Bitir" onayı */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#0d0d10] p-6"
          >
            <div className="flex items-center gap-2.5 text-zinc-100">
              <AlertTriangle size={18} className="text-amber-400" />
              <span className="font-medium">Denemeyi bitir?</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {blankCount > 0
                ? `${blankCount} soru boş kalacak. Bitirince cevaplar değerlendirilir.`
                : "Tüm sorular cevaplandı. Cevaplar değerlendirilecek."}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-white/[0.1] px-4 py-2 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                Vazgeç
              </button>
              <button
                onClick={finish}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
              >
                Bitir ve değerlendir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
