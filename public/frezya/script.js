/* ═══════════════════════════════════════════════════════════════
   PROJECT FREZYA — script.js
   One rAF loop per canvas, zero libraries, zero dependencies.

   Structure:
     1. Helpers
     2. Galaxy      — starfield with parallax + brightness boost
     3. FX          — cursor hearts, heart burst, ambient dust
     4. Intro       — boot sequence + progress milestones
     5. Scene 404   — the fake error that isn't one
     6. Main        — letter typewriter, reveals, heart, modals,
                      audio, easter egg
   ═══════════════════════════════════════════════════════════════ */
"use strict";

/* ── 1. Helpers ───────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => a + Math.random() * (b - a);
const PARAMS = new URLSearchParams(location.search);
/* reduced motion calms particles & parallax but never hides the story;
   ?full forces everything on, ?skip jumps straight to the page */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches && !PARAMS.has("full");
const SKIP_ALL = PARAMS.has("skip");
if (PARAMS.has("full")) document.documentElement.classList.add("force-motion");

let skipped = false;      // user pressed "skip"
let mainStarted = false;  // guard: main experience starts exactly once

/* ── 2. Galaxy — the starfield ────────────────────────────────── */
class Galaxy {
  constructor(canvas, nebulaEl) {
    this.cv = canvas;
    this.cx = canvas.getContext("2d");
    this.nebula = nebulaEl;
    this.stars = [];
    this.px = 0; this.py = 0;             // smoothed parallax
    this.tx = 0; this.ty = 0;             // parallax target
    this.boost = 1; this.boostTarget = 1; // brightness multiplier
    this.dpr = Math.min(devicePixelRatio || 1, 1.75);

    this.resize();
    addEventListener("resize", () => this.resize(), { passive: true });
    addEventListener("pointermove", (e) => {
      this.tx = e.clientX / innerWidth - 0.5;
      this.ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });

    requestAnimationFrame((t) => this.tick(t));
  }

  resize() {
    const { cv, dpr } = this;
    this.w = innerWidth; this.h = innerHeight;
    cv.width = this.w * dpr;
    cv.height = this.h * dpr;
    this.cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.spawn();
  }

  spawn() {
    const count = Math.max(90, Math.min(220, Math.round((this.w * this.h) / 9000)));
    const colors = ["#ffffff", "#e9e2ff", "#cdb9ff", "#f6d9ee"];
    this.stars = Array.from({ length: count }, () => {
      const z = Math.random();                 // depth: 0 far … 1 near
      return {
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        z,
        r: 0.4 + z * 1.3,
        a: 0.25 + z * 0.6,
        vx: -(0.02 + z * 0.05),                // slow drift westward
        tws: rand(0.4, 1.6),                   // twinkle speed
        twp: rand(0, Math.PI * 2),             // twinkle phase
        c: colors[(Math.random() * colors.length) | 0],
      };
    });
  }

  shine() {              // stars burn brighter after the heart is opened
    this.boost = 2.1;
    this.boostTarget = 1.3;
  }

  tick(t) {
    requestAnimationFrame((n) => this.tick(n));
    if (document.hidden) return;
    const { cx } = this;

    this.px += (this.tx - this.px) * 0.035;
    this.py += (this.ty - this.py) * 0.035;
    this.boost += (this.boostTarget - this.boost) * 0.02;
    if (this.nebula) {
      this.nebula.style.transform =
        `translate3d(${(-this.px * 26).toFixed(1)}px, ${(-this.py * 18).toFixed(1)}px, 0)`;
    }

    cx.clearRect(0, 0, this.w, this.h);
    for (const s of this.stars) {
      s.x += s.vx;
      if (s.x < -4) s.x = this.w + 4;
      const tw = 0.55 + 0.45 * Math.sin(t * 0.001 * s.tws + s.twp);
      cx.globalAlpha = Math.min(1, s.a * tw * this.boost);
      cx.fillStyle = s.c;
      const px = s.x + this.px * s.z * 30;
      const py = s.y + this.py * s.z * 20;
      if (s.r < 0.9) {
        cx.fillRect(px, py, s.r * 2, s.r * 2);
      } else {
        cx.beginPath();
        cx.arc(px, py, s.r, 0, 6.2832);
        cx.fill();
      }
    }
    cx.globalAlpha = 1;
  }
}

/* ── 3. FX — hearts that follow the cursor, bursts, dust ─────── */
class FX {
  constructor(canvas) {
    this.cv = canvas;
    this.cx = canvas.getContext("2d");
    this.dpr = Math.min(devicePixelRatio || 1, 1.75);
    this.parts = [];
    this.trailCount = 0;
    this.ambientOn = false;

    // Pre-rendered glowing heart sprites → no shadowBlur at runtime
    this.sprites = ["#a78bfa", "#8b5cf6", "#f2a6d8"].map((c) => FX.makeSprite(c));
    // petal sprites join the bursts (FX is instantiated after Petals is defined)
    this.petalSprites = ["#f2a6d8", "#c9aef7"].map((c) => Petals.sprite(c));

    this.resize();
    addEventListener("resize", () => this.resize(), { passive: true });
    requestAnimationFrame(() => this.tick());
  }

  static makeSprite(color) {
    const s = document.createElement("canvas");
    s.width = s.height = 64;
    const c = s.getContext("2d");
    c.translate(32, 30);
    c.scale(1.15, 1.15);
    const path = new Path2D(
      "M0 -6 C-4 -13 -15 -12 -16 -3 C-17 5 -7 11 0 17 C7 11 17 5 16 -3 C15 -12 4 -13 0 -6 Z"
    );
    c.shadowColor = color;
    c.shadowBlur = 14;
    c.fillStyle = color;
    c.fill(path);
    c.fill(path); // second pass deepens the glow
    return s;
  }

  resize() {
    this.w = innerWidth; this.h = innerHeight;
    this.cv.width = this.w * this.dpr;
    this.cv.height = this.h * this.dpr;
    this.cx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /* a single soft heart at the cursor */
  trail(x, y) {
    if (this.trailCount > 22) return; // elegance = restraint
    this.trailCount++;
    this.parts.push({
      kind: "trail",
      x, y,
      vx: rand(-0.25, 0.25),
      vy: rand(-0.8, -0.35),
      s: rand(9, 17),
      rot: rand(-0.5, 0.5),
      vr: 0,
      life: 1,
      decay: rand(0.011, 0.02),
      sp: this.sprites[Math.random() < 0.82 ? 0 : 2],
    });
  }

  /* hundreds of tiny hearts & petals exploding from the big one */
  burst(x, y, n = 220) {
    for (let i = 0; i < n; i++) {
      const ang = rand(0, Math.PI * 2);
      const spd = rand(1.2, 8.5);
      this.parts.push({
        kind: "burst",
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - rand(0.5, 2),
        s: rand(5, 15),
        rot: rand(-1, 1),
        vr: rand(-0.12, 0.12),
        life: 1,
        decay: rand(0.005, 0.014),
        sp: Math.random() < 0.3
          ? this.petalSprites[(Math.random() * 2) | 0]
          : this.sprites[(Math.random() * 3) | 0],
      });
    }
    this.startAmbient();
  }

  /* soft dust that keeps floating after the moment */
  startAmbient() {
    if (this.ambientOn || REDUCED) return;
    this.ambientOn = true;
    for (let i = 0; i < 22; i++) this.dust(true);
  }

  dust(anywhere) {
    this.parts.push({
      kind: "dust",
      x: rand(0, this.w),
      y: anywhere ? rand(0, this.h) : this.h + 12,
      vx: rand(-0.12, 0.12),
      vy: rand(-0.28, -0.1),
      s: rand(3, 6.5),
      rot: 0, vr: 0,
      life: rand(0.4, 1),
      decay: rand(0.0012, 0.0028),
      sp: this.sprites[(Math.random() * 3) | 0],
    });
  }

  tick() {
    requestAnimationFrame(() => this.tick());
    if (document.hidden) return;
    const { cx, parts } = this;
    cx.clearRect(0, 0, this.w, this.h);
    if (!parts.length) return;

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life -= p.decay;
      if (p.life <= 0) {
        if (p.kind === "trail") this.trailCount--;
        parts.splice(i, 1);
        if (p.kind === "dust" && this.ambientOn) this.dust(false); // recycle
        continue;
      }
      if (p.kind === "burst") { p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.05; }
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;

      const fade = p.life < 0.3 ? p.life / 0.3 : 1;
      cx.globalAlpha = fade * (p.kind === "dust" ? 0.5 : 0.95);
      const half = p.s / 2;
      if (p.rot) {
        cx.save();
        cx.translate(p.x, p.y);
        cx.rotate(p.rot);
        cx.drawImage(p.sp, -half, -half, p.s, p.s);
        cx.restore();
      } else {
        cx.drawImage(p.sp, p.x - half, p.y - half, p.s, p.s);
      }
    }
    cx.globalAlpha = 1;
  }
}

/* ── Petals — freesia petals drifting down like a quiet snowfall ─ */
class Petals {
  constructor(canvas) {
    this.cv = canvas;
    this.cx = canvas.getContext("2d");
    this.dpr = Math.min(devicePixelRatio || 1, 1.75);
    this.sprites = ["#c9aef7", "#f2a6d8", "#9d7bea"].map((c) => Petals.sprite(c));
    this.resize();
    addEventListener("resize", () => this.resize(), { passive: true });
    requestAnimationFrame((t) => this.tick(t));
  }

  static sprite(color) {
    const s = document.createElement("canvas");
    s.width = s.height = 48;
    const c = s.getContext("2d");
    c.translate(24, 24);
    c.shadowColor = color;
    c.shadowBlur = 6;
    c.fillStyle = color;
    c.beginPath();                       // teardrop petal
    c.moveTo(0, -15);
    c.bezierCurveTo(9, -8, 8, 5, 0, 15);
    c.bezierCurveTo(-8, 5, -9, -8, 0, -15);
    c.fill();
    return s;
  }

  resize() {
    this.w = innerWidth; this.h = innerHeight;
    this.cv.width = this.w * this.dpr;
    this.cv.height = this.h * this.dpr;
    this.cx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const n = Math.max(8, Math.min(20, Math.round(this.w / 80)));
    this.list = Array.from({ length: n }, () => this.make(true));
  }

  make(anywhere) {
    const z = rand(0.45, 1);                       // depth: small = far
    return {
      x: rand(0, this.w),
      y: anywhere ? rand(-this.h * 0.2, this.h) : rand(-60, -20),
      z,
      vy: 0.16 + rand(0.2, 0.5) * z,
      swayS: rand(0.0005, 0.0013),
      phase: rand(0, 6.283),
      rot: rand(0, 6.283),
      vr: rand(-0.012, 0.012),
      s: rand(11, 22) * z,
      alpha: rand(0.22, 0.48) * z,
      sp: this.sprites[(Math.random() * this.sprites.length) | 0],
    };
  }

  tick(t) {
    requestAnimationFrame((n) => this.tick(n));
    if (document.hidden) return;
    const { cx } = this;
    const wind = Math.sin(t * 0.00012) * 0.28;     // slow breeze, changes direction
    cx.clearRect(0, 0, this.w, this.h);
    for (const p of this.list) {
      p.y += p.vy;
      p.x += Math.cos(t * p.swayS + p.phase) * 0.34 * p.z + wind * p.z;
      p.rot += p.vr + Math.sin(t * p.swayS + p.phase) * 0.004;
      if (p.y > this.h + 26 || p.x < -40 || p.x > this.w + 40) Object.assign(p, this.make(false));
      cx.globalAlpha = p.alpha;
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.drawImage(p.sp, -p.s / 2, -p.s / 2, p.s, p.s);
      cx.restore();
    }
    cx.globalAlpha = 1;
  }
}

/* ── Meadow — a night garden swaying at the bottom of the screen ─ */
class Meadow {
  constructor(canvas) {
    this.cv = canvas;
    this.cx = canvas.getContext("2d");
    this.dpr = Math.min(devicePixelRatio || 1, 1.75);
    this.resize();
    addEventListener("resize", () => this.resize(), { passive: true });
    if (REDUCED) this.draw(0);                     // still image, no breeze
    else requestAnimationFrame((t) => this.tick(t));
  }

  resize() {
    this.w = innerWidth;
    this.h = Math.round(Math.min(190, innerHeight * 0.24));
    this.cv.width = this.w * this.dpr;
    this.cv.height = this.h * this.dpr;
    this.cv.style.width = this.w + "px";
    this.cv.style.height = this.h + "px";
    this.cx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.generate();
    if (REDUCED) this.draw(0);
  }

  generate() {
    const { w, h } = this;
    // grass blades
    this.blades = Array.from({ length: Math.round(w / 12) }, () => ({
      x: rand(0, w),
      h: rand(16, h * 0.42) * (Math.random() < 0.08 ? 1.7 : 1),
      lean: rand(-14, 14),
      lw: rand(1.3, 3),
      c: ["#0d061e", "#140b2b", "#1a0f38"][(Math.random() * 3) | 0],
      phase: rand(0, 6.283),
      speed: rand(0.0004, 0.001),
      amp: rand(2, 6),
    }));
    // freesia stems — curved, with a one-sided row of buds like real freesias
    const m = Math.max(3, Math.round(w / 240));
    this.stems = Array.from({ length: m }, (_, i) => ({
      x: (w / m) * (i + 0.5) + rand(-70, 70),
      h: rand(h * 0.55, h * 0.92),
      lean: rand(-18, 18),
      buds: 4 + ((Math.random() * 3) | 0),
      dir: Math.random() < 0.5 ? -1 : 1,
      phase: rand(0, 6.283),
      speed: rand(0.0003, 0.0007),
      amp: rand(3, 8),
    }));
  }

  draw(t) {
    const { cx, w, h } = this;
    cx.clearRect(0, 0, w, h);

    // soft dark ground haze
    const g = cx.createLinearGradient(0, h * 0.35, 0, h);
    g.addColorStop(0, "rgba(16, 8, 34, 0)");
    g.addColorStop(1, "rgba(14, 7, 30, 0.9)");
    cx.fillStyle = g;
    cx.fillRect(0, 0, w, h);

    cx.lineCap = "round";
    for (const b of this.blades) {
      const sway = Math.sin(t * b.speed + b.phase) * b.amp;
      cx.strokeStyle = b.c;
      cx.lineWidth = b.lw;
      cx.beginPath();
      cx.moveTo(b.x, h + 2);
      cx.quadraticCurveTo(b.x + b.lean * 0.4, h - b.h * 0.55, b.x + b.lean + sway, h - b.h);
      cx.stroke();
    }

    for (const s of this.stems) {
      const sway = Math.sin(t * s.speed + s.phase) * s.amp;
      const p0x = s.x,               p0y = h + 2;
      const p1x = s.x + s.lean * 0.3, p1y = h - s.h * 0.55;
      const p2x = s.x + s.lean + sway, p2y = h - s.h;
      cx.strokeStyle = "#170c30";
      cx.lineWidth = 2.1;
      cx.beginPath();
      cx.moveTo(p0x, p0y);
      cx.quadraticCurveTo(p1x, p1y, p2x, p2y);
      cx.stroke();

      // buds along the top of the stem; the youngest two catch the moonlight
      for (let k = 0; k < s.buds; k++) {
        const f = k / (s.buds - 1);
        const q = 0.62 + f * 0.38;                 // position on the curve
        const inv = 1 - q;
        const qx = inv * inv * p0x + 2 * inv * q * p1x + q * q * p2x;
        const qy = inv * inv * p0y + 2 * inv * q * p1y + q * q * p2y;
        const size = 7.5 * (1 - f * 0.45);
        cx.save();
        cx.translate(qx + s.dir * (3 + f * 9), qy - 1);
        cx.rotate(s.dir * (0.65 + f * 0.5));
        cx.fillStyle =
          k === s.buds - 1 ? "rgba(242, 166, 216, 0.5)" :
          k === s.buds - 2 ? "rgba(167, 139, 250, 0.38)" :
          "#1d1140";
        cx.beginPath();
        cx.ellipse(0, 0, size * 0.55, size, 0, 0, 6.283);
        cx.fill();
        cx.restore();
      }
    }
  }

  tick(t) {
    requestAnimationFrame((n) => this.tick(n));
    if (document.hidden) return;
    this.draw(t);
  }
}

/* boot the background layers */
const galaxy = new Galaxy($("#galaxy"), $("#nebula"));
const fx = new FX($("#fx"));
const meadow = new Meadow($("#meadow"));
const petals = REDUCED ? null : new Petals($("#petals"));

/* debug handle — QA sırasında katmanlara erişim için */
window.__frezya = { galaxy, fx, meadow, petals };

/* cursor hearts — throttled by distance & time so it never spams */
if (!REDUCED) {
  let lx = -99, ly = -99, lt = 0;
  addEventListener("pointermove", (e) => {
    const now = performance.now();
    const d = Math.hypot(e.clientX - lx, e.clientY - ly);
    if (d > 30 || (now - lt > 120 && d > 7)) {
      fx.trail(e.clientX + rand(-5, 5), e.clientY + rand(-5, 5));
      lx = e.clientX; ly = e.clientY; lt = now;
    }
  }, { passive: true });
}

/* ── 4. Intro — boot sequence ─────────────────────────────────── */
async function typeInto(el, text, speed = 36) {
  el.classList.add("is-typing");
  for (const ch of text) {
    if (skipped) { el.textContent = text; break; }
    el.textContent += ch;
    await wait(speed + Math.random() * 26);
  }
  el.classList.remove("is-typing");
}

function setProgress(v) {
  $("#loaderFill").style.width = v + "%";
  $("#loaderPct").textContent = Math.round(v) + "%";
}

function animateProgress(from, to, dur) {
  return new Promise((res) => {
    if (skipped) { setProgress(to); return res(); }
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      setProgress(from + (to - from) * ease(k));
      if (k < 1 && !skipped) requestAnimationFrame(step);
      else res();
    })(t0);
  });
}

async function setLoaderMsg(text) {
  const el = $("#loaderMsg");
  el.classList.remove("show");
  await wait(skipped ? 0 : 260);
  el.textContent = text;
  el.classList.add("show");
}

async function runIntro() {
  await wait(900);
  await typeInto($("#tLine1"), "Başlatılıyor...");
  await wait(350);
  await typeInto($("#tLine2"), "Proje Frezya", 55);
  await wait(350);
  await typeInto($("#tLine3"), "Anılar yükleniyor...");
  await wait(400);
  if (skipped) return;

  $("#loader").classList.add("show");
  await wait(500);

  const steps = [
    { to: 11, dur: 900,  hold: 1000, msg: "Discord..." },
    { to: 28, dur: 900,  hold: 1000, msg: "10 Temmuz 2026" },
    { to: 54, dur: 1100, hold: 1000, msg: "Bir yabancı..." },
    { to: 76, dur: 1000, hold: 1150, msg: "Daha yakından tanımak istediğim biri..." },
    { to: 99, dur: 1500, hold: 1200, msg: "" },
  ];
  let from = 0;
  for (const s of steps) {
    await animateProgress(from, s.to, s.dur);
    if (skipped) return;
    await setLoaderMsg(s.msg);
    await wait(s.hold);
    from = s.to;
  }
  await animateProgress(99, 100, 300);
  await wait(500);
}

/* ── 5. Scene 404 ─────────────────────────────────────────────── */
async function run404() {
  if (skipped) return;
  const scene = $("#scene404");
  scene.classList.remove("overlay--dormant");

  const main404 = $("#s404Main");
  main404.classList.add("show");
  await wait(2600); if (skipped) return;

  $("#s404Wait").classList.add("show");
  await wait(1700); if (skipped) return;

  main404.classList.remove("show");
  await wait(1000); if (skipped) return;

  $("#maybe1").classList.add("show");
  await wait(3000); if (skipped) return;
  $("#maybe1").classList.remove("show");
  await wait(900); if (skipped) return;

  $("#maybe2").classList.add("show");
  await wait(3200); if (skipped) return;
  $("#maybe2").classList.remove("show");
  await wait(900);
}

/* ── 6. Main experience ───────────────────────────────────────── */

/* mektup — nefes alan paragraflar hâlinde */
const LETTER = [
  ["Bu sayfayı tek bir sebeple yaptım.",
   "Seni şaşırtmak için.",
   "Belki gülümsetmek için.",
   "Belki de bu kadar küçük bir şeye birinin ne kadar emek verebileceğini düşündürmek için."],
  ["İşin aslı şu...",
   "Bazen emek, kelimelerden daha çok şey anlatır."],
  ["Birbirimizi daha 10 Temmuz'dan beri tanıyoruz.",
   "Uzun bir süre değil.",
   "Ama seni tanımaktan keyif almama yetti."],
  ["Bu hikâye nereye gider, bilmiyorum.",
   "Belki hiçbir yere.",
   "Belki çok güzel bir yere."],
  ["Öyle ya da böyle...",
   "Yollarımızın kesişmesine gerçekten sevindim."],
  ["Eğer bir gün geri dönüp bu sayfayı birlikte okursak...",
   "Umarım o zaman bu, artık sadece gizli bir sayfa olmaz.",
   "Umarım bir anıya dönüşür."],
];

let letterFast = false;
let letterDone = false;
let letterStarted = false;

async function typeLetter() {
  if (letterStarted) return;
  letterStarted = true;

  const nameEl = $("#letterName");
  const body = $("#letterBody");

  // "Meryem," — typed slowly, like it matters
  nameEl.classList.add("is-typing");
  for (const ch of "Meryem,") {
    if (!letterFast) await wait(150);
    nameEl.textContent += ch;
  }
  nameEl.classList.remove("is-typing");
  if (!letterFast) await wait(500);

  for (const par of LETTER) {
    const wrap = document.createElement("div");
    wrap.className = "par";
    body.appendChild(wrap);
    for (const line of par) {
      const p = document.createElement("p");
      wrap.appendChild(p);
      if (letterFast) { p.textContent = line; continue; }
      p.classList.add("is-typing");
      for (const ch of line) {
        if (letterFast) { p.textContent = line; break; }
        p.textContent += ch;
        await wait(24 + Math.random() * 22);
      }
      p.classList.remove("is-typing");
      if (!letterFast) await wait(300);
    }
    if (!letterFast) await wait(280);
  }

  letterDone = true;
  $("#letterSign").classList.add("show");
  $("#letterHint").classList.add("gone");
}

function initLetter() {
  const card = $("#letterCard");
  card.addEventListener("click", () => {
    if (!letterDone) letterFast = true;
  });
  if (REDUCED) { letterFast = true; typeLetter(); return; }
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { obs.disconnect(); typeLetter(); }
  }, { threshold: 0.45 }).observe(card);
}

/* scroll reveals */
function initReveals() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }
  }, { threshold: 0.25 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

/* the final heart */
function initHeart() {
  const heart = $("#heart");
  let opened = false;
  heart.addEventListener("click", () => {
    const r = heart.getBoundingClientRect();
    fx.burst(r.left + r.width / 2, r.top + r.height / 2, opened ? 90 : 240);
    galaxy.shine();
    const flash = $("#flash");
    flash.classList.remove("go");
    void flash.offsetWidth;      // restart the animation
    flash.classList.add("go");

    if (!opened) {
      opened = true;
      $("#heartWhisper").classList.add("gone");
      const finalText = $("#finalText");
      finalText.hidden = false;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => finalText.classList.add("is-in"))
      );
    }
  });
}

/* modals — why frezya? + easter egg */
function openModal(modal) {
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add("show"));
}
function closeModal(modal) {
  modal.classList.remove("show");
  setTimeout(() => { modal.hidden = true; }, 450);
}
function initModals() {
  const why = $("#whyModal");
  const egg = $("#eggModal");
  $("#whyBtn").addEventListener("click", () => openModal(why));
  for (const m of [why, egg]) {
    m.addEventListener("click", (e) => {
      if (e.target === m || e.target.hasAttribute("data-close")) closeModal(m);
    });
  }
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    for (const m of [why, egg]) if (!m.hidden) closeModal(m);
  });
}

/* easter egg — type F R E Z Y A anywhere */
function initEasterEgg() {
  let buffer = "";
  addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-6);
    if (buffer === "frezya") {
      buffer = "";
      openModal($("#eggModal"));
      galaxy.shine();
    }
  });
}

/* mobil sır — başlıktaki "Frezya" kelimesine art arda 6 dokunuş
   (frezya = 6 harf; klavyesi olmayanlar için aynı kapının anahtarı) */
function initTapEgg() {
  const word = $(".hero__title em");
  if (!word) return;
  let taps = 0, last = 0;
  word.addEventListener("pointerdown", () => {
    const now = performance.now();
    taps = now - last < 900 ? taps + 1 : 1;
    last = now;
    if (taps >= 6) {
      taps = 0;
      openModal($("#eggModal"));
      galaxy.shine();
    }
  });
}

/* audio — never autoplays; graceful placeholder if the file is missing */
function initAudio() {
  const btn = $("#audioBtn");
  const label = $("#audioLabel");
  const song = $("#song");
  song.volume = 0.85;

  btn.addEventListener("click", async () => {
    if (!song.paused) {
      song.pause();
      btn.classList.remove("playing");
      label.textContent = "Şarkımızı çal";
      return;
    }
    try {
      await song.play();                    // assets/song.mp3 yoksa reddedilir
      btn.classList.add("playing");
      label.textContent = "şarkımız";
    } catch {
      label.textContent = "şarkı yakında…";
      btn.title = "şarkıyı /frezya/assets/ içine song.mp3 veya song.mp4 olarak koy";
      setTimeout(() => { label.textContent = "Şarkımızı çal"; }, 3200);
    }
  });
}

/* hand over from the overlays to the page itself */
function startMain() {
  if (mainStarted) return;
  mainStarted = true;
  skipped = true;                            // stops any overlay timeline still awaiting

  $("#intro").classList.add("overlay--gone");
  $("#scene404").classList.add("overlay--dormant");
  setTimeout(() => { $("#intro").remove(); $("#scene404").remove(); }, 1000);

  document.body.classList.remove("locked");
  const main = $("#experience");
  main.hidden = false;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => main.classList.add("is-in"))
  );
  $("#audioBtn").hidden = false;

  initReveals();
  initLetter();
  initHeart();
}

/* ── boot ─────────────────────────────────────────────────────── */
(async function boot() {
  document.body.classList.add("locked");
  initModals();
  initEasterEgg();
  initTapEgg();
  initAudio();

  console.log(
    "%c✦ Proje Frezya %c— yalnızca bir kişi için yapıldı.",
    "color:#a78bfa;font-size:14px;font-family:Georgia,serif;font-style:italic;",
    "color:#8b8b9e;font-size:12px;"
  );

  if (SKIP_ALL) { startMain(); return; }

  $("#skipBtn").addEventListener("click", startMain);
  $("#scene404").addEventListener("click", startMain);

  await runIntro();
  if (!mainStarted) {
    $("#intro").classList.add("overlay--gone");
    await wait(900);
    await run404();
  }
  startMain();
})();
