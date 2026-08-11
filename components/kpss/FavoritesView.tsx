"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { getFavorites } from "@/lib/kpss/storage";
import { questionById } from "@/lib/kpss/data";
import type { Question } from "@/lib/kpss/types";
import { EASE, Overline, TopBar } from "./ui";
import QuestionCard from "./QuestionCard";

export default function FavoritesView({
  onExit,
  onStudy,
}: {
  onExit: () => void;
  onStudy: (ids: string[]) => void;
}) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(getFavorites()), []);

  const questions = ids
    .map(questionById)
    .filter((q): q is Question => Boolean(q));

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onExit} title="Favoriler" />

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Overline>Favoriler</Overline>
        <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-white">
          <Star size={22} className="shrink-0 fill-amber-300 text-amber-300" aria-hidden="true" />
          Yıldızladığın sorular
        </h1>
      </motion.header>

      {questions.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.01] p-10 text-center">
          <Star size={28} className="mx-auto text-zinc-700" />
          <p className="mt-3 text-sm text-zinc-400">Henüz favori soru yok.</p>
          <p className="mt-1 text-xs text-mute-3">
            Çalışırken bir sorunun sağ üstündeki ⭐ düğmesine basınca burada
            birikir.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-mute-2">
              <span className="font-mono text-zinc-300">{questions.length}</span>{" "}
              favori soru
            </span>
            <button
              onClick={() => onStudy(ids)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              <Play size={15} /> Favorilerle çalış
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id}>
                <div className="mb-2 font-mono text-xs text-mute-3">
                  {idx + 1} / {questions.length}
                </div>
                <QuestionCard
                  question={q}
                  selectedIndex={null}
                  revealed
                  onSelect={() => {}}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
