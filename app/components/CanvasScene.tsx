"use client";

import { useEffect, useRef } from "react";

type CanvasSceneProps = {
  className?: string;
};

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  dir: number;
  tw: number;
};

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const createStars = (count: number, seed: number): Star[] => {
  const rand = createSeededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    r: 0.6 + rand() * 1.4,
    a: 0.25 + rand() * 0.55,
    dir: rand() > 0.5 ? 1 : -1,
    tw: 0.003 + rand() * 0.006,
  }));
};

const STAR_TEMPLATE = createStars(120, 1337);
const STAR_STORAGE_KEY = "lynkhub_star_state_v1";

export default function CanvasScene({ className }: CanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loadStars = () => {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.localStorage.getItem(STAR_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { stars: Star[] } | null;
        if (!parsed?.stars?.length) return null;
        return parsed.stars.map((star) => ({ ...star }));
      } catch {
        return null;
      }
    };

    const stars = loadStars() ?? STAR_TEMPLATE.map((star) => ({ ...star }));
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId = 0;
    let width = 0;
    let height = 0;
    let lastTime = 0;

    const drawStars = () => {
      for (const star of stars) {
        ctx.fillStyle = `rgba(125, 211, 252, ${star.a})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const saveStars = () => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(
          STAR_STORAGE_KEY,
          JSON.stringify({ stars })
        );
      } catch {
        // Ignore storage errors (private mode, quota).
      }
    };

    const render = (time: number) => {
      if (prefersReduced.matches && time !== 0) return;
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      drawStars();

      if (!prefersReduced.matches) {
        for (const star of stars) {
          star.a += star.dir * star.tw * delta * 0.06;
          if (star.a > 0.85 || star.a < 0.2) {
            star.dir *= -1;
          }
        }
        rafId = window.requestAnimationFrame(render);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(0);
    };

    resize();
    if (!prefersReduced.matches) {
      rafId = window.requestAnimationFrame(render);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        saveStars();
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("beforeunload", saveStars);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("beforeunload", saveStars);
      document.removeEventListener("visibilitychange", handleVisibility);
      saveStars();
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
