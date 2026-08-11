// KPSS neti: doğru − yanlış/4. Boş bırakılanlar nete girmez.
//
// ÖSYM'nin "dört yanlış bir doğruyu götürür" kuralının tek kaynağı burasıdır;
// hem sınav değerlendirmesi hem de net göstergeleri aynı formülü kullanır ki
// ikisi asla ayrışmasın. (KpssSınav/lib/core/utils/net_score.dart ile birebir.)
export function kpssNet(correct: number, wrong: number): number {
  return correct - wrong / 4;
}

/** Neti okunur biçimde yazar: tam sayıysa ondalık gösterme, değilse iki hane. */
export function formatNet(net: number): string {
  return Number.isInteger(net) ? net.toFixed(0) : net.toFixed(2);
}
