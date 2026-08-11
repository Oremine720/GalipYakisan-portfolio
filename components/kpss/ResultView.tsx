"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Minus, RotateCcw, Home, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FinishedSession } from "@/lib/kpss/session";
import { summarize, toExamRecord } from "@/lib/kpss/session";
import type { SubjectBreakdown } from "@/lib/kpss/storage";
import { saveExamRecord } from "@/lib/kpss/storage";
import { formatNet } from "@/lib/kpss/net";
import { subjectName } from "@/lib/kpss/data";
import { EASE, Overline, TopBar } from "./ui";
import QuestionCard from "./QuestionCard";

export default function ResultView({
  session,
  onRestart,
  onExit,
}: {
  session: FinishedSession;
  onRestart: () => void;
  onExit: () => void;
}) {
  const sum = useMemo(() => summarize(session), [session]);
  const [review, setReview] = useState(false);
  const modeLabel = session.mode === "exam" ? "Deneme" : "Çalışma";

  // Sonucu geçmişe bir kez kaydet.
  useEffect(() => {
    saveExamRecord(toExamRecord(session, sum));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acc = Math.round(sum.accuracy * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onExit} title={`${modeLabel} · Sonuç`} />

      {/* Net kartı */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 text-center sm:p-8"
      >
        <Overline>{modeLabel} Sonucu</Overline>
        {/* text-6xl + p-8: "12.75 net" 320px ekranda kart dışına taşıyordu. */}
        <div className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          {formatNet(sum.net)}
          <span className="ml-2 text-xl font-normal text-mute-2">net</span>
        </div>
        <p className="mt-2 text-sm text-mute-2">
          {sum.total} soru · %{acc} isabet
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatTile
            icon={<Check size={16} />}
            value={sum.correct}
            label="Doğru"
            cls="border-emerald-400/25 bg-emerald-500/[0.07] text-emerald-300"
          />
          <StatTile
            icon={<X size={16} />}
            value={sum.wrong}
            label="Yanlış"
            cls="border-rose-400/25 bg-rose-500/[0.07] text-rose-300"
          />
          <StatTile
            icon={<Minus size={16} />}
            value={sum.blank}
            label="Boş"
            cls="border-white/[0.08] bg-white/[0.02] text-zinc-400"
          />
        </div>
      </motion.div>

      {/* Ders kırılımı */}
      {sum.bySubject.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5"
        >
          <Overline>Ders Bazında</Overline>
          <div className="mt-4 space-y-4">
            {sum.bySubject.map((b) => (
              <SubjectRow key={b.subjectId} b={b} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Aksiyonlar */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          <RotateCcw size={16} /> Yeniden
        </button>
        <button
          onClick={() => setReview((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
        >
          <ListChecks size={16} /> {review ? "İncelemeyi gizle" : "Çözümleri incele"}
        </button>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
        >
          <Home size={16} /> Ana sayfa
        </button>
      </div>

      {/* İnceleme: tüm sorular, cevaplı ve çözümlü */}
      {review && (
        <div className="mt-8 space-y-4">
          {session.questions.map((q, idx) => (
            <div key={q.id}>
              <div className="mb-2 font-mono text-xs text-mute-3">
                {idx + 1} / {session.questions.length}
              </div>
              <QuestionCard
                question={q}
                selectedIndex={session.answers[q.id] ?? null}
                revealed
                onSelect={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
  cls,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  cls: string;
}) {
  return (
    <div className={cn("rounded-xl border p-3", cls)}>
      <div className="flex items-center justify-center gap-1.5 text-2xl font-semibold">
        {icon}
        {value}
      </div>
      <div className="mt-0.5 text-xs text-mute-2">{label}</div>
    </div>
  );
}

function SubjectRow({ b }: { b: SubjectBreakdown }) {
  const pct = (n: number) => (b.total ? (n / b.total) * 100 : 0);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-zinc-200">{subjectName(b.subjectId)}</span>
        <span className="font-mono text-xs text-mute-2">
          {formatNet(b.net)} net · {b.correct}/{b.total}
        </span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <div className="h-full bg-emerald-500/70" style={{ width: `${pct(b.correct)}%` }} />
        <div className="h-full bg-rose-500/70" style={{ width: `${pct(b.wrong)}%` }} />
        <div className="h-full bg-white/10" style={{ width: `${pct(b.blank)}%` }} />
      </div>
    </div>
  );
}
