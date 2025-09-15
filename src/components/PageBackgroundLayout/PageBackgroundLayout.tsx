import React, { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./PageBackgroundLayout.module.scss";

const PageBackgroundLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let isRunning = true;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resizeToRoot = () => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      // Reset transform before resizing to avoid compound scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeToRoot();
    const ro = new ResizeObserver(resizeToRoot);
    if (rootRef.current) ro.observe(rootRef.current);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; o: number };
    const particles: Particle[] = [];
    const getTargetCount = () => {
      const root = rootRef.current;
      if (!root) return 40;
      const rect = root.getBoundingClientRect();
      return Math.floor((rect.width * rect.height) / 24000);
    };
    const targetCount = getTargetCount();
    for (let i = 0; i < targetCount; i++) {
      particles.push({
        x: Math.random() * (canvas.style.width ? parseFloat(canvas.style.width) : window.innerWidth),
        y: Math.random() * (canvas.style.height ? parseFloat(canvas.style.height) : window.innerHeight),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.4,
        o: Math.random() * 0.35 + 0.15,
      });
    }

    const step = () => {
      if (!isRunning) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.5)";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;

        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrame);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      {/* Grid scrolls with content (absolute inside root) */}
      <div className={styles.grid} aria-hidden />
      {/* Particles now scroll with content as well */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PageBackgroundLayout;


