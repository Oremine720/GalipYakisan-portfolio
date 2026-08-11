// Konu dağılımı (blueprint) motoru.
//
// taxonomy.json'daki her alt konuda `blueprintWeight` var ve ağırlıklar
// DERS İÇİNDE 1.0'a toplanıyor. Bu dosyaya kadar o veri hiçbir yerde
// okunmuyordu — deneme soruları düpedüz rastgele seçiliyordu. Buradaki
// iş, "N soruluk bir oturumda hangi alt konudan kaç soru çıkmalı"
// sorusunu ağırlıklara sadık kalarak cevaplamak.

// NOT: taksonomiyi data.ts üzerinden değil doğrudan okuyoruz —
// data.ts buradaki planQuota'yı kullandığı için aksi halde döngüsel
// import oluşurdu.
import taxonomyJson from "./data/taxonomy.json";
import type { Subject, SubTopic } from "./types";

const subjects: Subject[] =
  (taxonomyJson.subjects as unknown as Subject[]) ?? [];

export interface WeightedSubTopic {
  subTopicId: string;
  subjectId: string;
  weight: number;
}

/** Taksonomideki tüm alt konular, ders kimliğiyle birlikte düzleştirilmiş. */
export function weightedSubTopics(subjectId?: string | null): WeightedSubTopic[] {
  const out: WeightedSubTopic[] = [];
  for (const subject of subjects) {
    if (subjectId && subject.id !== subjectId) continue;
    for (const topic of subject.topics ?? []) {
      for (const st of topic.subTopics ?? []) {
        out.push({
          subTopicId: st.id,
          subjectId: subject.id,
          // Ağırlık yoksa eşit paylaşıma düşsün.
          weight: normalizeWeight(st),
        });
      }
    }
  }
  return out;
}

function normalizeWeight(st: SubTopic): number {
  const w = st.blueprintWeight;
  return typeof w === "number" && Number.isFinite(w) && w > 0 ? w : 0;
}

/**
 * "En büyük kalan" (largest remainder) yöntemiyle kotaları dağıtır.
 *
 * Neden bu yöntem: ağırlıkları doğrudan çarpıp yuvarlarsak toplam
 * istenen soru sayısını tutturamayız (10 soruluk denemede 9 ya da 11 soru
 * çıkar). Largest remainder toplamı garanti eder ve küçük ağırlıklı
 * konuların tamamen kaybolmasını engeller.
 *
 * @param available alt konu → havuzda gerçekten kaç soru olduğu.
 *                  Kota bu sayıyı asla aşmaz; aşan pay diğerlerine dağılır.
 */
export function planQuota(
  weights: WeightedSubTopic[],
  count: number,
  available: Map<string, number>,
): Map<string, number> {
  const quota = new Map<string, number>();
  if (count <= 0) return quota;

  // Havuzda sorusu olmayan alt konuyu plana hiç almıyoruz; ağırlığı
  // kalanlar arasında yeniden normalize ediliyor. Aksi halde 41 boş alt
  // konu tüm kotayı yutar ve deneme yarım kalırdı.
  let pool = weights
    .map((w) => ({ ...w, cap: available.get(w.subTopicId) ?? 0 }))
    .filter((w) => w.cap > 0 && w.weight > 0);

  if (pool.length === 0) return quota;

  const capTotal = pool.reduce((s, w) => s + w.cap, 0);
  let remaining = Math.min(count, capTotal);

  // Bir alt konu tavanına dayandığında artan payı yeniden dağıtmak için
  // döngü kuruyoruz; her turda en az bir konu ya doyar ya da kota biter.
  while (remaining > 0 && pool.length > 0) {
    const weightTotal = pool.reduce((s, w) => s + w.weight, 0);
    if (weightTotal <= 0) break;

    const rows = pool.map((w) => {
      const exact = (w.weight / weightTotal) * remaining;
      const base = Math.min(Math.floor(exact), w.cap);
      return { ...w, exact, base, frac: exact - Math.floor(exact) };
    });

    let assigned = 0;
    for (const r of rows) {
      if (r.base > 0) {
        quota.set(r.subTopicId, (quota.get(r.subTopicId) ?? 0) + r.base);
        assigned += r.base;
      }
    }

    // Kalanı en büyük ondalık artığa göre birer birer dağıt.
    let leftover = remaining - assigned;
    if (leftover > 0) {
      const eligible = rows
        .filter((r) => (quota.get(r.subTopicId) ?? 0) < r.cap)
        .sort((a, b) => b.frac - a.frac || b.weight - a.weight);
      for (const r of eligible) {
        if (leftover === 0) break;
        quota.set(r.subTopicId, (quota.get(r.subTopicId) ?? 0) + 1);
        leftover -= 1;
        assigned += 1;
      }
    }

    remaining -= assigned;
    if (assigned === 0) break; // ilerleme yoksa sonsuz döngüye girme

    // Doyanları çıkar, kalanlarla devam et.
    pool = pool.filter((w) => (quota.get(w.subTopicId) ?? 0) < w.cap);
  }

  return quota;
}

/**
 * Bir oturumun ağırlıklara ne kadar uyduğunu ölçer (0..1; 1 = birebir).
 * İstatistik ekranında "dağılıma uyum" göstermek için.
 */
export function blueprintFit(
  planned: Map<string, number>,
  weights: WeightedSubTopic[],
): number {
  const total = [...planned.values()].reduce((s, n) => s + n, 0);
  if (total === 0) return 0;

  const eligible = weights.filter((w) => w.weight > 0);
  const weightTotal = eligible.reduce((s, w) => s + w.weight, 0);
  if (weightTotal <= 0) return 0;

  // Toplam mutlak sapmanın yarısı = toplam varyasyon mesafesi.
  let deviation = 0;
  for (const w of eligible) {
    const target = w.weight / weightTotal;
    const actual = (planned.get(w.subTopicId) ?? 0) / total;
    deviation += Math.abs(target - actual);
  }
  return Math.max(0, 1 - deviation / 2);
}
