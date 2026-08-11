import type { Metadata } from "next";
import KpssApp from "@/components/kpss/KpssApp";
import KpssGate from "@/components/kpss/KpssGate";
import { isAuthed } from "@/lib/kpss/auth";

export const metadata: Metadata = {
  title: "KPSS Çalışma & Deneme",
  description:
    "KPSS Ön Lisans — konuya göre soru çöz, süreli deneme yap, ÖSYM netini gör. Mobil uyumlu; otobüste bile telefondan çalış.",
  // Özel alan: arama motorlarına kapalı.
  robots: { index: false, follow: false },
};

// Her istekte çerezi okumamız gerekiyor; statik prerender'ı kapat.
export const dynamic = "force-dynamic";

export default async function KpssPage() {
  const authed = await isAuthed();

  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative z-10 min-h-[100svh] px-4 pb-24 pt-4 focus:outline-none sm:px-6"
    >
      {authed ? <KpssApp /> : <KpssGate />}
    </main>
  );
}
