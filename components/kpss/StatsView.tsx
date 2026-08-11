"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Timer, BookOpen, Play, Trash2, AlertTriangle } from "lucide-react";
import {
  getStats,
  getHistory,
  getWrongIds,
  resetProgress,
  type Stats,
  type ExamRecord,
} from "@/lib/kpss/storage";
import { subjectName } from "@/lib/kpss/data";
import { formatNet } from "@/lib/kpss/net";
import { getRelativeTime } from "@/lib/utils";
import { EASE, Overline, TopBar } from "./ui";

export default function StatsView({
  onExit,
  onStudyWrong,
}: {
  onExit: () => void;
  onStudyWrong: (ids: string[]) => void;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<ExamRecord[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);

  function load() {
    setStats(getStats());
    setHistory(getHistory());
    setWrong(getWrongIds());
  }
  useEffect(load, []);

  const acc = stats && stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const subjectRows = stats
    ? Object.entries(stats.bySubject).sort((a, b) => b[1].answered - a[1].answered)
    : [];
  const nothing = !stats || (stats.answered === 0 && history.length === 0);

  return (
    <div className="mx-auto max-w-3xl">
      <TopBar onBack={onExit} title="İstatistik" />

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <Overline>İstatistik</Overline>
        <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-white">
          <BarChart3 size={22} className="text-indigo-400" />
          İlerlemen
        </h1>
      </motion.header>

      {nothing ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.01] p-10 text-center">
          <BarChart3 size={28} className="mx-auto text-zinc-700" />
          <p className="mt-3 text-sm text-zinc-400">Henüz veri yok.</p>
          <p className="mt-1 text-xs text-zinc-600">
            Biraz çalış veya deneme yap; ilerlemen burada birikecek.
          </p>
        </div>
      ) : (
        <>
          {/* Genel */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Tile value={stats!.answered} label="Çözülen soru" />
            <Tile value={stats!.correct} label="Doğru" cls="text-emerald-300" />
            <Tile value={`%${acc}`} label="İsabet" cls="text-indigo-300" />
          </div>

          {/* Ders bazlı doğru oranı */}
          {subjectRows.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5">
              <Overline>Ders Bazında Doğru Oranı</Overline>
              <div className="mt-4 space-y-4">
                {subjectRows.map(([sid, v]) => {
                  const rate = v.answered ? Math.round((v.correct / v.answered) * 100) : 0;
                  return (
                    <div key={sid}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-zinc-200">{subjectName(sid)}</span>
                        <span className="font-mono text-xs text-zinc-500">
                          %{rate} · {v.correct}/{v.answered}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-indigo-500/70"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Yanlışlar defteri */}
          {wrong.length > 0 && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-rose-400/15 bg-rose-500/[0.05] p-5">
              <div>
                <div className="text-sm font-medium text-zinc-100">
                  Yanlışlar defteri
                </div>
                <div className="text-xs text-zinc-500">
                  {wrong.length} soruyu yanlış çözdün — tekrar dene.
                </div>
              </div>
              <button
                onClick={() => onStudyWrong(wrong)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
              >
                <Play size={15} /> Yanlışları çöz
              </button>
            </div>
          )}

          {/* Geçmiş */}
          {history.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5">
              <Overline>Geçmiş Oturumlar</Overline>
              <div className="mt-3 divide-y divide-white/[0.05]">
                {history.slice(0, 20).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400">
                      {r.mode === "exam" ? <Timer size={15} /> : <BookOpen size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-zinc-200">
                        {r.mode === "exam" ? "Deneme" : "Çalışma"} ·{" "}
                        {r.subjectId ? subjectName(r.subjectId) : "Karışık"}
                      </div>
                      <div className="text-xs text-zinc-600">
                        {getRelativeTime(r.dateISO)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-sm text-white">
                        {formatNet(r.net)} net
                      </div>
                      <div className="text-xs text-zinc-600">
                        {r.correct}/{r.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sıfırla */}
          <div className="mt-6 flex justify-center">
            {confirmReset ? (
              <div className="flex items-center gap-3 rounded-lg border border-rose-400/20 bg-rose-500/[0.06] px-4 py-2.5">
                <AlertTriangle size={15} className="text-amber-400" />
                <span className="text-sm text-zinc-300">Tüm ilerleme silinsin mi?</span>
                <button
                  onClick={() => {
                    resetProgress();
                    load();
                    setConfirmReset(false);
                  }}
                  className="rounded-md bg-rose-500 px-3 py-1 text-xs font-medium text-white hover:bg-rose-400"
                >
                  Evet, sil
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="rounded-md px-3 py-1 text-xs text-zinc-400 hover:text-white"
                >
                  Vazgeç
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-rose-300"
              >
                <Trash2 size={13} /> İlerlemeyi sıfırla
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Tile({
  value,
  label,
  cls,
}: {
  value: number | string;
  label: string;
  cls?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 text-center">
      <div className={`text-2xl font-semibold text-white ${cls ?? ""}`}>{value}</div>
      <div className="mt-0.5 text-xs text-zinc-500">{label}</div>
    </div>
  );
}
