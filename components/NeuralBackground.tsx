"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulse: number;
  pulseSpeed: number;
  color: string;
}

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4"];

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const buildNodes = () => {
      // Yoğunluk ekran alanına göre — mobilde daha az node (performans)
      const area = width * height;
      const isMobile = width < 768;
      const density = isMobile ? 14000 : 9000;
      const count = Math.min(
        isMobile ? 45 : 110,
        Math.max(28, Math.floor(area / density))
      );

      const nodes: Node[] = [];
      for (let i = 0; i < count; i++) {
        const baseRadius = Math.random() * 1.6 + 0.8;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: baseRadius,
          baseRadius,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      nodesRef.current = nodes;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    resize();

    const CONNECT_DIST = width < 768 ? 110 : 150;
    const MOUSE_DIST = 200;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Node'ları güncelle ve mouse etkileşimi
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (!reducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          n.pulse += n.pulseSpeed;
        }

        // Kenarlardan sek
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        // Mouse yakınlığı — node büyür ve mouse'a hafif çekilir
        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        let glow = 0;
        if (mDist < MOUSE_DIST) {
          glow = 1 - mDist / MOUSE_DIST;
          n.x += mdx * 0.012 * glow;
          n.y += mdy * 0.012 * glow;
        }

        const pulseScale = reducedMotion ? 1 : 1 + Math.sin(n.pulse) * 0.25;
        n.radius = n.baseRadius * pulseScale + glow * 2;

        // Node çiz (parlama efektiyle)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.4 + glow * 0.6;
        ctx.fill();

        if (glow > 0.2) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + glow * 6, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.globalAlpha = glow * 0.12;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      // Bağlantı çizgileri (sinaps)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.18;

            // Mouse yakınındaki çizgiler daha parlak
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const mdx = mouse.x - midX;
            const mdy = mouse.y - midY;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            const mouseBoost = mDist < MOUSE_DIST ? (1 - mDist / MOUSE_DIST) * 0.5 : 0;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = a.color;
            ctx.globalAlpha = opacity + mouseBoost;
            ctx.lineWidth = 0.6 + mouseBoost;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
