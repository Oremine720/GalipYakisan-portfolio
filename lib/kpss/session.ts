import type { Question } from "./types";
import { kpssNet } from "./net";
import type { ExamRecord, SubjectBreakdown } from "./storage";

/** Bitmiş bir çalışma/sınav oturumu — sonuç ve inceleme bundan türetilir. */
export interface FinishedSession {
  mode: "study" | "exam";
  subjectId: string | null;
  questions: Question[];
  /** soru id → seçilen şık indeksi; kayıt yoksa boş bırakılmış. */
  answers: Record<string, number>;
  startedAtISO: string;
  durationSec?: number;
}

export interface SessionSummary {
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  net: number;
  /** cevaplananlar içinde doğru oranı (0..1). */
  accuracy: number;
  bySubject: SubjectBreakdown[];
}

/** Oturumu ÖSYM mantığıyla özetler (net = doğru − yanlış/4). */
export function summarize(s: FinishedSession): SessionSummary {
  const { questions, answers } = s;
  let correct = 0;
  let answered = 0;
  const acc: Record<
    string,
    { total: number; correct: number; wrong: number; blank: number }
  > = {};

  for (const q of questions) {
    let a = acc[q.subjectId];
    if (!a) {
      a = { total: 0, correct: 0, wrong: 0, blank: 0 };
      acc[q.subjectId] = a;
    }
    a.total += 1;
    const sel = answers[q.id];
    if (sel === undefined) {
      a.blank += 1;
    } else {
      answered += 1;
      if (sel === q.correctIndex) {
        correct += 1;
        a.correct += 1;
      } else {
        a.wrong += 1;
      }
    }
  }

  const wrong = answered - correct;
  const blank = questions.length - answered;
  const bySubject: SubjectBreakdown[] = Object.entries(acc)
    .map(([subjectId, v]) => ({
      subjectId,
      total: v.total,
      correct: v.correct,
      wrong: v.wrong,
      blank: v.blank,
      net: kpssNet(v.correct, v.wrong),
    }))
    .sort((a, b) => b.total - a.total);

  return {
    total: questions.length,
    correct,
    wrong,
    blank,
    net: kpssNet(correct, wrong),
    accuracy: answered ? correct / answered : 0,
    bySubject,
  };
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Oturum + özetten kalıcı geçmiş kaydı üretir. */
export function toExamRecord(
  s: FinishedSession,
  sum: SessionSummary,
): ExamRecord {
  return {
    id: newId(),
    dateISO: s.startedAtISO,
    mode: s.mode,
    subjectId: s.subjectId,
    total: sum.total,
    correct: sum.correct,
    wrong: sum.wrong,
    blank: sum.blank,
    net: sum.net,
    durationSec: s.durationSec,
    bySubject: sum.bySubject,
  };
}
