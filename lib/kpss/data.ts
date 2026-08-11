import seedPack from "./data/seed_pack_v1.json";
import taxonomyJson from "./data/taxonomy.json";
import type { Question, Subject, Topic, SubTopic } from "./types";
import { planQuota, weightedSubTopics } from "./blueprint";
import { getStats, type Stats } from "./storage";

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
  /**
   * Alt konu kotalarını taxonomy.json'daki blueprintWeight'e göre dağıt.
   * Varsayılan açık; yalnızca `count` verildiğinde anlamlı.
   * onlyIds ile birlikte otomatik devre dışı (tekrar seti zaten sabit).
   */
  useBlueprint?: boolean;
}

/**
 * Bir alt konu içinde soruları çalışma değerine göre sıralar:
 * hiç görülmemiş → henüz pekişmemiş → en uzun süredir görülmemiş.
 * Böylece havuz küçükken bile aynı soruları arka arkaya görmüyorsun.
 */
function byStudyValue(
  pool: Question[],
  byQuestion: Stats["byQuestion"],
): Question[] {
  return shuffle(pool)
    .map((q) => {
      const r = byQuestion[q.id];
      const tier = !r ? 0 : r.streak === 0 ? 1 : 2;
      return { q, tier, lastAt: r?.lastAtISO ?? "" };
    })
    .sort((a, b) => a.tier - b.tier || a.lastAt.localeCompare(b.lastAt))
    .map((x) => x.q);
}

/** Filtreli + (varsayılan) karışık soru seçer — sınav/çalışma oturumu için. */
export function pickQuestions(opts: PickOptions = {}): Question[] {
  const {
    subjectId,
    count,
    shuffle: doShuffle = true,
    onlyIds,
    useBlueprint = true,
  } = opts;

  let pool = subjectId ? questionsBySubject(subjectId) : questions.slice();
  if (onlyIds) {
    const set = new Set(onlyIds);
    pool = pool.filter((q) => set.has(q.id));
    // Tekrar seti: sıra kullanıcının defterinden gelir, blueprint uygulanmaz.
    return doShuffle ? shuffle(pool) : pool.slice();
  }

  // Sayı verilmediyse havuzun tamamı isteniyordur; dağıtacak kota yok.
  // Yine de sıra körlemesine rastgele olmasın: hiç görmediğin sorular
  // öne, pekişenler sona gelsin (tur içinde soru sayısı değişmiyor).
  if (typeof count !== "number") {
    if (!doShuffle) return pool.slice();
    return byStudyValue(pool, getStats().byQuestion);
  }

  if (!useBlueprint) {
    const flat = doShuffle ? shuffle(pool) : pool.slice();
    return flat.slice(0, count);
  }

  // --- Blueprint'e göre dağıt ---
  const available = new Map<string, number>();
  const bySubTopic = new Map<string, Question[]>();
  for (const q of pool) {
    const list = bySubTopic.get(q.subTopicId);
    if (list) list.push(q);
    else bySubTopic.set(q.subTopicId, [q]);
  }
  for (const [id, list] of bySubTopic) available.set(id, list.length);

  const quota = planQuota(weightedSubTopics(subjectId), count, available);

  // İlerleme kaydını bir kez oku — alt konu başına ayrı ayrı okumak
  // 56 localStorage erişimi + JSON.parse demek olurdu.
  const { byQuestion } = getStats();

  const picked: Question[] = [];
  const used = new Set<string>();
  for (const [subTopicId, n] of quota) {
    const list = bySubTopic.get(subTopicId) ?? [];
    for (const q of byStudyValue(list, byQuestion).slice(0, n)) {
      picked.push(q);
      used.add(q.id);
    }
  }

  // Ağırlığı olmayan / taksonomide bulunmayan alt konular kotaya
  // giremediği için eksik kalabilir; kalanı çalışma değerine göre tamamla.
  if (picked.length < count) {
    const rest = byStudyValue(
      pool.filter((q) => !used.has(q.id)),
      byQuestion,
    );
    picked.push(...rest.slice(0, count - picked.length));
  }

  return doShuffle ? shuffle(picked) : picked;
}

/** Sınav modu için havuza göre uyarlanan boyut seçenekleri (ör. 10, tüm havuz). */
export function examSizeOptions(subjectId?: string | null): number[] {
  const pool = subjectId ? questionsBySubject(subjectId).length : totalQuestionCount;
  const candidates = [10, 15, 25, 50, 100, 120];
  const sizes = candidates.filter((n) => n < pool);
  sizes.push(pool); // her zaman "tüm havuz"
  return Array.from(new Set(sizes)).sort((a, b) => a - b);
}
