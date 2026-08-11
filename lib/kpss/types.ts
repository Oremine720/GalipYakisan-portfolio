// KPSS soru + konu (taxonomy) tipleri.
// KpssSınav (Flutter) domain modelinin web/TypeScript karşılığıdır.

export type Difficulty = "KOLAY" | "ORTA" | "ZOR";

export type QuestionSource = "seedPack" | "aiGenerated";

export type ReviewStatus =
  | "unreviewed"
  | "flaggedByUser"
  | "verifiedGood"
  | "retired";

/** Bir sorunun tek şıkkı (A..E). */
export interface AnswerOption {
  label: string; // "A".."E"
  text: string;
  isCorrect: boolean;
  /** Bu şık neden doğru/yanlış — çalışma modunda gösterilir. */
  explanation: string;
  /** Şıkka özel yaygın yanılgı etiketi (istatistik için), olmayabilir. */
  misconceptionTag?: string | null;
}

/** Uygulamanın etrafında döndüğü çekirdek varlık. */
export interface Question {
  id: string;
  /** ör. "turkce.dil_bilgisi.sozcukte_yapi" */
  subTopicId: string;
  subjectId: string;
  topicId: string;
  difficulty: Difficulty;
  /** Soru gövdesi; **markdown** kalın/işaretleme içerebilir. */
  stem: string;
  /** Paragraf sorularında ortak okuma metni; yoksa null. */
  passage?: string | null;
  /** Tam 5 şık, etiketleri A..E, sırası zaten karışık. */
  options: AnswerOption[];
  /** options içindeki doğru şıkkın indeksi (0..4). */
  correctIndex: number;
  /** Adım adım ayrıntılı çözüm. */
  solution: string;
  /** Cevabı açık etmeyen tek cümlelik yönlendirme. */
  hint: string;
  /** Bu sorudan çıkarılacak, aktarılabilir kural. */
  learningNote: string;
  testedKazanimlar?: string[];
  source?: QuestionSource;
  reviewStatus?: ReviewStatus;
}

export interface SubTopic {
  id: string;
  name: string;
  blueprintWeight?: number;
  kazanimlar?: string[];
}

export interface Topic {
  id: string;
  name: string;
  subTopics: SubTopic[];
}

export interface Subject {
  id: string;
  name: string;
  /** Material ikon adı (Flutter'dan); web'de kendi eşlememizi yaparız. */
  icon?: string;
  /** Dersin tema rengi tohumu, ör. "#2E7D5B". */
  colorSeed?: string;
  topics: Topic[];
}
