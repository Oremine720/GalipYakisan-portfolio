// KPSS ilerleme/favori verisi — tamamen tarayıcıda (localStorage).
// Sunucuda (SSR) çağrılırsa güvenli biçimde boş döner.
//
// v2 notu: v1'de istatistik yalnızca {answered, correct, bySubject}
// tutuyordu. Bunun iki büyük sorunu vardı:
//   1) `answered` denemeyi sayıyordu, farklı soruyu değil — 15 soruluk
//      havuzu üç kez dönünce "45 çözülen soru" yazıyordu.
//   2) Alt konu kırılımı yoktu, yani "hangi konuda zayıfım" sorusunun
//      cevabı yoktu; oysa uygulamanın tamamı konu dağılımı üstüne kurulu.
// v2 bunun yerine soru bazında deneme kaydı tutuyor; toplamlar buradan
// türetiliyor. Böylece "kaç farklı soru", "kaç deneme", "hangi alt konu
// zayıf" ve "hangi soru pekişti" sorularının hepsi cevaplanabiliyor.

const NS = "kpss:v2:";
const LEGACY_NS = "kpss:v1:";

const K = {
  favorites: NS + "favorites",
  history: NS + "history",
  stats: NS + "stats",
  migrated: NS + "migrated",
} as const;

const LEGACY = {
  favorites: LEGACY_NS + "favorites",
  history: LEGACY_NS + "history",
  stats: LEGACY_NS + "stats",
  wrong: LEGACY_NS + "wrong",
} as const;

/** Bir soru kaç kez üst üste doğru bilinirse "pekişmiş" sayılır. */
export const MASTERY_STREAK = 2;

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
  migrateOnce();
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
  migrateOnce();
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

// ---------- Soru bazlı ilerleme ----------
/** Tek bir sorunun geçmişi. Tüm toplamlar bundan türetilir. */
export interface AttemptRecord {
  attempts: number;
  correct: number;
  /** üst üste doğru sayısı; yanlışta sıfırlanır */
  streak: number;
  lastCorrect: boolean;
  lastAtISO: string;
  /** Kırılımları soruyu tekrar aramadan çıkarabilmek için kopyalanıyor. */
  subjectId: string;
  subTopicId: string;
}

export interface Bucket {
  answered: number;
  correct: number;
}

export interface Stats {
  byQuestion: Record<string, AttemptRecord>;
  bySubject: Record<string, Bucket>;
  bySubTopic: Record<string, Bucket>;
}

const emptyStats = (): Stats => ({
  byQuestion: {},
  bySubject: {},
  bySubTopic: {},
});

export function getStats(): Stats {
  migrateOnce();
  const s = read<Stats>(K.stats, emptyStats());
  // Eski/bozuk kayıtlara karşı savunma.
  return {
    byQuestion: s.byQuestion ?? {},
    bySubject: s.bySubject ?? {},
    bySubTopic: s.bySubTopic ?? {},
  };
}

/** recordAnswer'ın ihtiyaç duyduğu asgari soru bilgisi. */
export interface AnsweredQuestion {
  id: string;
  subjectId: string;
  subTopicId: string;
}

function bump(map: Record<string, Bucket>, key: string, isCorrect: boolean) {
  if (!key) return;
  const b = map[key] ?? { answered: 0, correct: 0 };
  b.answered += 1;
  if (isCorrect) b.correct += 1;
  map[key] = b;
}

/** Tek bir cevabı işler (çalışma modu). */
export function recordAnswer(q: AnsweredQuestion, isCorrect: boolean): void {
  recordAnswers([{ question: q, isCorrect }]);
}

/**
 * Birden çok cevabı tek yazımda işler.
 * Sınav modu bunu kullanıyor: v1'de ExamRunner recordAnswer'ı hiç
 * çağırmıyordu, dolayısıyla denemede çözülen hiçbir soru istatistiğe
 * ya da yanlışlar defterine girmiyordu.
 */
export function recordAnswers(
  entries: { question: AnsweredQuestion; isCorrect: boolean }[],
): void {
  if (entries.length === 0) return;
  const s = getStats();
  const nowISO = new Date().toISOString();

  for (const { question, isCorrect } of entries) {
    const prev = s.byQuestion[question.id];
    s.byQuestion[question.id] = {
      attempts: (prev?.attempts ?? 0) + 1,
      correct: (prev?.correct ?? 0) + (isCorrect ? 1 : 0),
      streak: isCorrect ? (prev?.streak ?? 0) + 1 : 0,
      lastCorrect: isCorrect,
      lastAtISO: nowISO,
      subjectId: question.subjectId,
      subTopicId: question.subTopicId,
    };
    bump(s.bySubject, question.subjectId, isCorrect);
    bump(s.bySubTopic, question.subTopicId, isCorrect);
  }

  write(K.stats, s);
}

// ---------- Türetilmiş görünümler ----------
export interface Progress {
  /** kaç FARKLI soru denendi */
  distinct: number;
  /** toplam deneme sayısı (aynı soru tekrar çözülünce artar) */
  attempts: number;
  /** toplam doğru deneme */
  correct: number;
  /** doğru/deneme (0..1) */
  accuracy: number;
  /** streak >= MASTERY_STREAK olan soru sayısı */
  mastered: number;
}

export function getProgress(): Progress {
  const { byQuestion } = getStats();
  const rows = Object.values(byQuestion);
  const attempts = rows.reduce((n, r) => n + r.attempts, 0);
  const correct = rows.reduce((n, r) => n + r.correct, 0);
  return {
    distinct: rows.length,
    attempts,
    correct,
    accuracy: attempts ? correct / attempts : 0,
    mastered: rows.filter((r) => r.streak >= MASTERY_STREAK).length,
  };
}

/**
 * Yanlışlar defteri: denenmiş ama henüz üst üste doğru serisi olmayan
 * sorular. v1'de bu düz bir set'ti — bir kez doğru yapınca siliniyordu,
 * beş kez yanlış yapmış olman fark etmiyordu.
 */
export function getWrongIds(): string[] {
  const { byQuestion } = getStats();
  return Object.entries(byQuestion)
    .filter(([, r]) => r.attempts > 0 && r.streak === 0)
    .sort((a, b) => {
      // Önce en çok yanlışlanan, sonra en eski görülen.
      const aMiss = a[1].attempts - a[1].correct;
      const bMiss = b[1].attempts - b[1].correct;
      if (bMiss !== aMiss) return bMiss - aMiss;
      return a[1].lastAtISO.localeCompare(b[1].lastAtISO);
    })
    .map(([id]) => id);
}

export interface SubTopicStat extends Bucket {
  subTopicId: string;
  rate: number;
}

/** Doğru oranı en düşük alt konular — "neye çalışmalıyım" için. */
export function getWeakSubTopics(minAnswered = 2, limit = 8): SubTopicStat[] {
  const { bySubTopic } = getStats();
  return Object.entries(bySubTopic)
    .map(([subTopicId, b]) => ({
      subTopicId,
      ...b,
      rate: b.answered ? b.correct / b.answered : 0,
    }))
    .filter((r) => r.answered >= minAnswered)
    .sort((a, b) => a.rate - b.rate || b.answered - a.answered)
    .slice(0, limit);
}

export function resetProgress(): void {
  write(K.stats, emptyStats());
  write(K.history, []);
}

// ---------- v1 → v2 taşıma ----------
/**
 * Eski kayıtları bir kez yeni şemaya taşır.
 * v1 soru bazında veri tutmadığı için toplamları birebir kurtaramıyoruz;
 * kurtarılabilen tek şey yanlışlar defteri (hangi sorular yanlıştı) ve
 * oturum geçmişi. Ders kırılımı toplamları da taşınıyor ki "İsabet"
 * yüzdesi sıfırlanmış görünmesin.
 */
function migrateOnce(): void {
  if (!canUse()) return;
  if (read<boolean>(K.migrated, false)) return;
  write(K.migrated, true);

  try {
    const legacyStats = read<{
      answered?: number;
      correct?: number;
      bySubject?: Record<string, Bucket>;
    } | null>(LEGACY.stats, null);
    const legacyWrong = read<string[]>(LEGACY.wrong, []);
    const legacyHistory = read<ExamRecord[]>(LEGACY.history, []);
    const legacyFavorites = read<string[]>(LEGACY.favorites, []);

    if (legacyFavorites.length && read<string[]>(K.favorites, []).length === 0) {
      write(K.favorites, legacyFavorites);
    }
    if (legacyHistory.length && read<ExamRecord[]>(K.history, []).length === 0) {
      write(K.history, legacyHistory);
    }

    if (!legacyStats && legacyWrong.length === 0) return;

    const s = emptyStats();
    if (legacyStats?.bySubject) s.bySubject = legacyStats.bySubject;

    const nowISO = new Date().toISOString();
    for (const id of legacyWrong) {
      // Alt konu bilgisi v1'de yoktu; defterde kalması yeterli.
      s.byQuestion[id] = {
        attempts: 1,
        correct: 0,
        streak: 0,
        lastCorrect: false,
        lastAtISO: nowISO,
        subjectId: "",
        subTopicId: "",
      };
    }
    write(K.stats, s);
  } catch {
    /* taşıma başarısızsa temiz başla — veri kaybı kritik değil */
  }
}
