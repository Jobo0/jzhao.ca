import React, { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./PageBackgroundLayout.module.scss";

type PageBackgroundMode = "scroll" | "fixed";

type PageBackgroundLayoutProps = PropsWithChildren<{
  backgroundMode?: PageBackgroundMode;
}>;

const PageBackgroundLayout: React.FC<PageBackgroundLayoutProps> = ({
  children,
  backgroundMode = "scroll",
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isFixedBackground = backgroundMode === "fixed";

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
      const rawWidth = isFixedBackground ? window.innerWidth : rect.width;
      const rawHeight = isFixedBackground ? window.innerHeight : rect.height;
      // Round to integer CSS pixels so the backing store aligns exactly with
      // the displayed size. On Windows with fractional DPR (e.g. 1.25/1.5),
      // sub-pixel mismatch between CSS size and buffer leaves a thin
      // uncleared strip at the right/bottom edge that accumulates particle
      // trails.
      const cssWidth = Math.round(rawWidth);
      const cssHeight = Math.round(rawHeight);
      // Reset transform before resizing to avoid compound scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeToRoot();
    const ro = new ResizeObserver(resizeToRoot);
    if (rootRef.current && !isFixedBackground) ro.observe(rootRef.current);
    window.addEventListener("resize", resizeToRoot);

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; o: number };
    const particles: Particle[] = [];
    const getTargetCount = () => {
      const root = rootRef.current;
      if (!root) return 40;
      const rect = root.getBoundingClientRect();
      const baseCount = Math.floor((rect.width * rect.height) / 24000);
      return isFixedBackground ? Math.max(1, Math.floor(baseCount / 3)) : baseCount;
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
      // Clear the entire backing store under an identity transform so every
      // device pixel is erased regardless of DPR rounding. This prevents
      // particle trails from accumulating in sub-pixel edges on Windows.
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
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
      window.removeEventListener("resize", resizeToRoot);
    };
  }, [isFixedBackground]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div
        className={`${styles.grid} ${isFixedBackground ? styles.gridFixed : styles.gridScroll}`}
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${isFixedBackground ? styles.canvasFixed : styles.canvasScroll}`}
        aria-hidden
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PageBackgroundLayout;


