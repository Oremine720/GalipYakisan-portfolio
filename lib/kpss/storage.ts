// KPSS ilerleme/favori verisi — tamamen tarayıcıda (localStorage).
// Sunucuda (SSR) çağrılırsa güvenli biçimde boş döner.

const NS = "kpss:v1:";
const K = {
  favorites: NS + "favorites",
  history: NS + "history",
  stats: NS + "stats",
  wrong: NS + "wrong",
} as const;

const canUse = (): boolean =>
  typeof window !== "undefined" && !!window.localStorage;

function read<T>(key: string, fallback: T): T {
  if (!canUse()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!canUse()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* kota dolu / gizli mod — sessizce geç */
  }
}

// ---------- Favoriler ----------
export function getFavorites(): string[] {
  return read<string[]>(K.favorites, []);
}
export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}
/** Favoriyi tersine çevirir; yeni durumu (favori mi) döndürür. */
export function toggleFavorite(id: string): boolean {
  const set = new Set(getFavorites());
  const nowFav = !set.has(id);
  if (nowFav) set.add(id);
  else set.delete(id);
  write(K.favorites, [...set]);
  return nowFav;
}

// ---------- Sınav / oturum geçmişi ----------
export interface SubjectBreakdown {
  subjectId: string;
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  net: number;
}
export interface ExamRecord {
  id: string;
  dateISO: string;
  mode: "exam" | "study";
  subjectId: string | null;
  total: number;
  correct: number;
  wrong: number;
  blank: number;
  net: number;
  durationSec?: number;
  bySubject: SubjectBreakdown[];
}
export function getHistory(): ExamRecord[] {
  return read<ExamRecord[]>(K.history, []);
}
export function saveExamRecord(rec: ExamRecord): void {
  const list = getHistory();
  list.unshift(rec);
  write(K.history, list.slice(0, 100)); // son 100 kayıt yeter
}
export function clearHistory(): void {
  write(K.history, []);
}

// ---------- Çalışma istatistiği + yanlışlar defteri ----------
export interface Stats {
  answered: number;
  correct: number;
  bySubject: Record<string, { answered: number; correct: number }>;
}
const emptyStats = (): Stats => ({ answered: 0, correct: 0, bySubject: {} });

export function getStats(): Stats {
  return read<Stats>(K.stats, emptyStats());
}

/** Çalışma modunda her cevabı işler: sayaçlar + yanlışlar defteri. */
export function recordAnswer(
  questionId: string,
  subjectId: string,
  isCorrect: boolean,
): void {
  const s = getStats();
  s.answered += 1;
  if (isCorrect) s.correct += 1;
  const sub = s.bySubject[subjectId] ?? { answered: 0, correct: 0 };
  sub.answered += 1;
  if (isCorrect) sub.correct += 1;
  s.bySubject[subjectId] = sub;
  write(K.stats, s);

  const wrong = new Set(getWrongIds());
  if (isCorrect) wrong.delete(questionId);
  else wrong.add(questionId);
  write(K.wrong, [...wrong]);
}

export function getWrongIds(): string[] {
  return read<string[]>(K.wrong, []);
}

export function resetProgress(): void {
  write(K.stats, emptyStats());
  write(K.wrong, []);
  write(K.history, []);
}
