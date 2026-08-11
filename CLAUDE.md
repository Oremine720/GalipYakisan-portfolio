# CLAUDE.md — Galip Yakışan Kişisel Site

Bu dosya, Claude Code'un projeyi her açılışta tanıması için talimat dosyasıdır.

## İletişim dili
**Galip ile Türkçe ve samimi konuş.** Kod, değişken adları, commit mesajları ve
teknik terimler İngilizce kalabilir; açıklamalar Türkçe olsun.

## Proje nedir
Galip Yakışan'ın kişisel portföy sitesi. **Next.js 15 (App Router)**, canlıda
**Vercel** üzerinde: https://galipyakisan.com
- Repo: github.com/Oremine720/GalipYakisan-portfolio · branch **main**
- **main'e her push Vercel'de otomatik production deploy tetikler.**

## Teknoloji yığını
- Next.js 15.5.19 · React 19 · TypeScript · Tailwind CSS 3.4
- framer-motion (animasyon), lucide-react (ikon), EmailJS (iletişim formu)
- Path alias: `@/` → proje kökü (ör. `@/lib/data`, `@/components/kpss/...`)

## Komutlar
```bash
npm run dev      # lokal geliştirme (http://localhost:3000)
npm run build    # production build — değişiklik sonrası bununla doğrula
npm run lint     # ESLint
```

## Klasör yapısı (önemli yerler)
- `app/` — App Router sayfaları (`page.tsx`, `layout.tsx`, `kpss/`, `api/kpss/`, `robots.ts`, `sitemap.ts`)
- `components/sections/` — ana sayfa bölümleri (Hero, About, Skills, Projects, GitHubStats, Education, Certificates, Contact, Footer)
- `components/kpss/` — KPSS uygulaması bileşenleri
- `lib/data.ts` — **sitedeki tüm içerik burada** (`PERSONAL_INFO`, `SKILLS`, `PROJECTS`, `EDUCATION`, `CERTIFICATES`, `SOCIAL_LINKS`). İçerik değişikliği çoğunlukla burada yapılır.
- `lib/kpss/` — KPSS mantığı (veri, oturum, storage, auth)
- `public/` — statik dosyalar (favicon/ikonlar, og-image, `frezya/` gizli sayfa)
- `_genassets.js` — favicon/ikon/OG görsellerini üreten script

## KPSS özel alanı (`/kpss`) — ŞİFRE İLE KORUNUYOR
`/kpss`, KPSS Ön Lisans soru-çözme uygulaması. **Yalnızca Galip girebilir.**
- Uygulama tamamen client-side; sorular `lib/kpss/data/*.json`'dan, ilerleme `localStorage`'da.
- **Erişim kilidi:** `app/kpss/page.tsx` sunucuda `isAuthed()` (`lib/kpss/auth.ts`) ile
  çerezi kontrol eder → geçerliyse `KpssApp`, değilse `KpssGate` (şifre ekranı) render eder.
- Giriş: `POST app/api/kpss/login` (şifreyi doğrular, httpOnly imzalı `kpss_session` çerezi bırakır).
  Çıkış: `POST app/api/kpss/logout`. KpssHome'da "Kilitle" butonu var.
- `/kpss` arama motorlarına kapalı (`robots.ts` disallow + sayfa `noindex`).

## Ortam değişkenleri & GÜVENLİK
- Server-only (NEXT_PUBLIC_ **değil**): `KPSS_PASSWORD`, `KPSS_SESSION_SECRET` → `/kpss` kilidi için.
- Public (client): `NEXT_PUBLIC_EMAILJS_*` → iletişim formu.
- Bunlar `.env.local`'de. **`.env.local` gitignore'da — ASLA commit etme, secret'ları koda yazma.**
- Prod'da `/kpss` girişinin çalışması için aynı KPSS_* değişkenleri **Vercel → Settings →
  Environment Variables**'da da tanımlı olmalı (Production). Değişince redeploy gerekir.

## Kod stili
- Koyu tema. Aksan renkleri indigo → mor → pembe (`#6366f1`, `#8b5cf6`, `#ec4899`).
- Tailwind idiom'u: `rounded-2xl border border-white/[0.07] bg-white/[0.015]`, hover'da
  kenarlık/parlaklık artışı. Mevcut component'lerin diline uy.
- Client bileşenleri `"use client"` ile başlar. İkonlar lucide-react, animasyon framer-motion.
- Yeni içerik eklerken önce `lib/data.ts`'e bak — çoğu şey oradan besleniyor.

## Git / deploy akışı
- Commit/push **yalnızca Galip isteyince** yap. Push = canlıya çıkar (Vercel prod).
- Commit sonrası mümkünse `npm run build` ile doğrula.
- Windows'ta LF→CRLF uyarıları normaldir, zararsız.

## Küçük notlar
- `/frezya` gizli bir sayfa (`public/frezya`, `next.config.ts`'te rewrite ile). Ana route'ları etkilemez.
- Site ve içerik Türkçe; kullanıcıya bakan tüm metinler Türkçe olmalı.
