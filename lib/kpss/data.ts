import seedPack from "./data/seed_pack_v1.json";
import taxonomyJson from "./data/taxonomy.json";
import type { Question, Subject, Topic, SubTopic } from "./types";

/** Uygulamayla gelen, elle gözden geçirilmiş soru havuzu. */
export const questions: Question[] =
  (seedPack.questions as unknown as Question[]) ?? [];

/** KPSS Ön Lisans konu ağacı (ders → konu → alt konu). */
export const subjects: Subject[] =
  (taxonomyJson.subjects as unknown as Subject[]) ?? [];

export const totalQuestionCount = questions.length;

// ---- Ders / konu arama ----
export const subjectById = (id: string): Subject | undefined =>
  subjects.find((s) => s.id === id);
export const subjectName = (id: string): string => subjectById(id)?.name ?? id;

const allTopics = (): Topic[] => subjects.flatMap((s) => s.topics ?? []);
export const topicById = (id: string): Topic | undefined =>
  allTopics().find((t) => t.id === id);
export const topicName = (id: string): string => topicById(id)?.name ?? id;

const allSubTopics = (): SubTopic[] =>
  allTopics().flatMap((t) => t.subTopics ?? []);
export const subTopicById = (id: string): SubTopic | undefined =>
  allSubTopics().find((st) => st.id === id);
export const subTopicName = (id: string): string =>
  subTopicById(id)?.name ?? id;

// ---- Soru filtreleri ----
export const questionById = (id: string): Question | undefined =>
  questions.find((q) => q.id === id);
export const questionsBySubject = (subjectId: string): Question[] =>
  questions.filter((q) => q.subjectId === subjectId);
export const questionsByTopic = (topicId: string): Question[] =>
  questions.filter((q) => q.topicId === topicId);
export const questionsBySubTopic = (subTopicId: string): Question[] =>
  questions.filter((q) => q.subTopicId === subTopicId);

/** Sadece havuzda sorusu olan dersler + adetleri (konu seçici için). */
export function subjectsWithCounts(): { subject: Subject; count: number }[] {
  return subjects
    .map((subject) => ({ subject, count: questionsBySubject(subject.id).length }))
    .filter((x) => x.count > 0);
}

// ---- Yardımcılar ----
/** Fisher–Yates; kopyayı karıştırır, orijinali bozmaz. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface PickOptions {
  /** null/undefined => tüm dersler */
  subjectId?: string | null;
  /** undefined => havuzdaki hepsi */
  count?: number;
  /** varsayılan: true */
  shuffle?: boolean;
  /** yalnızca bu id'lerden seç (favoriler / yanlışlar defteri) */
  onlyIds?: string[];
}

/** Filtreli + (varsayılan) karışık soru seçer — sınav/çalışma oturumu için. */
export function pickQuestions(opts: PickOptions = {}): Question[] {
  const { subjectId, count, shuffle: doShuffle = true, onlyIds } = opts;
  let pool = subjectId ? questionsBySubject(subjectId) : questions.slice();
  if (onlyIds) {
    const set = new Set(onlyIds);
    pool = pool.filter((q) => set.has(q.id));
  }
  pool = doShuffle ? shuffle(pool) : pool.slice();
  return typeof count === "number" ? pool.slice(0, count) : pool;
}

/** Sınav modu için havuza göre uyarlanan boyut seçenekleri (ör. 10, tüm havuz). */
export function examSizeOptions(subjectId?: string | null): number[] {
  const pool = subjectId ? questionsBySubject(subjectId).length : totalQuestionCount;
  const candidates = [10, 15, 25, 50, 100, 120];
  const sizes = candidates.filter((n) => n < pool);
  sizes.push(pool); // her zaman "tüm havuz"
  return Array.from(new Set(sizes)).sort((a, b) => a - b);
}
