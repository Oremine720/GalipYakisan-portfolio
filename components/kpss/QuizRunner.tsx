"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { pickQuestions, subjectName } from "@/lib/kpss/data";
import { recordAnswer } from "@/lib/kpss/storage";
import type { FinishedSession } from "@/lib/kpss/session";
import { EASE, TopBar } from "./ui";
import QuestionCard from "./QuestionCard";

export default function QuizRunner({
  subjectId,
  onlyIds,
  titleOverride,
  onExit,
  onFinish,
}: {
  subjectId: string | null;
  /** yalnızca bu sorularla çalış (favoriler / yanlışlar). */
  onlyIds?: string[];
  titleOverride?: string;
  onExit: () => void;
  onFinish: (s: FinishedSession) => void;
}) {
  const questions = useMemo(
    () => pickQuestions({ subjectId, onlyIds }),
    [subjectId, onlyIds],
  );
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const startRef = useRef<number>(Date.now());

  const title =
    titleOverride ?? (subjectId ? subjectName(subjectId) : "Karışık");

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <TopBar onBack={onExit} title="Çalışma" />
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-10 text-center text-sm text-zinc-400">
          Bu derste henüz soru yok. Havuza soru eklenince burada görünecek.
        </div>
      </div>
    );
  }

  const q = questions[i];
  const selected = answers[q.id] ?? null;
  const revealed = selected !== null;
  const isLast = i === questions.length - 1;
  const correct = questions.filter(
    (qq) => answers[qq.id] === qq.correctIndex,
  ).length;

  function select(idx: number) {
    if (answers[q.id] !== undefined) return; // çalışma modunda cevap kilitlenir
    setAnswers((a) => ({ ...a, [q.id]: idx }));
    recordAnswer(q, idx === q.correctIndex);
  }

  function next() {
    if (isLast) {
      onFinish({
        mode: "study",
        subjectId,
        questions,
        answers,
        startedAtISO: new Date(startRef.current).toISOString(),
        durationSec: Math.round((Date.now() - startRef.current) / 1000),
      });
    } else {
      setI((n) => n + 1);
      if (typeof window !== "undefined")
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const progress = ((i + (revealed ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onExit} title={`Çalışma · ${title}`} />

      {/* İlerleme */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs text-mute-2">
          <span className="font-mono">
            {i + 1} / {questions.length}
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={13} className="text-emerald-400" /> {correct} doğru
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-indigo-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </div>

      <QuestionCard
        question={q}
        selectedIndex={selected}
        revealed={revealed}
        onSelect={select}
        showHint
      />

      {/* Alt aksiyon */}
      {revealed && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {isLast ? "Bitir" : "Sonraki"} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
