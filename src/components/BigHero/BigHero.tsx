"use client";

import React, { useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import styles from "./BigHero.module.scss";
import ContentSection from "@/components/UI/ContentSection/ContentSection";

export type BigHeroProps = {
  title?: string;
  subtitle1?: string;
  subtitle2?: string;
  children?: React.ReactNode;
  className?: string;
};

const PARALLAX_PX = 7;
const PROXIMITY_MAX_PX = 110;
const PROXIMITY_OPACITY_MIN = 0.78;
const PROXIMITY_OPACITY_MAX = 1;

const springOpts = { stiffness: 120, damping: 22, mass: 0.45 };

type HeroLineProps = {
  text: string;
  className: string;
  as: "h1" | "p";
  charClassName: string;
};

const HeroLine = ({ text, className, as, charClassName }: HeroLineProps) => {
  const Tag = as;
  return (
    <Tag className={clsx(className, styles.interactiveLine)} aria-label={text}>
      <span className={styles.charRun} aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} data-hero-char className={clsx(styles.char, charClassName)}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default function BigHero({ title, subtitle1, subtitle2, children, className }: BigHeroProps) {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const springX = useSpring(0, springOpts);
  const springY = useSpring(0, springOpts);
  const pointerActiveRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  const flushPointer = useCallback(() => {
    const root = wrapRef.current;
    const p = pendingRef.current;
    if (!root || !p) return;
    const { x, y } = p;
    const active = pointerActiveRef.current;
    root.querySelectorAll<HTMLElement>("[data-hero-char]").forEach((span) => {
      const r = span.getBoundingClientRect();
      span.style.setProperty("--hero-glint-x", `${x - r.left}px`);
      span.style.setProperty("--hero-glint-y", `${y - r.top}px`);
      if (!active) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(x - cx, y - cy);
      const t = Math.max(0, 1 - d / PROXIMITY_MAX_PX);
      span.style.opacity = String(PROXIMITY_OPACITY_MIN + (PROXIMITY_OPACITY_MAX - PROXIMITY_OPACITY_MIN) * t);
    });
  }, []);

  const scheduleFlush = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      flushPointer();
    });
  }, [flushPointer]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const resetChars = useCallback(() => {
    const root = wrapRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-hero-char]").forEach((span) => {
      span.style.opacity = "";
      span.style.removeProperty("--hero-glint-x");
      span.style.removeProperty("--hero-glint-y");
    });
  }, []);

  const onPointerEnter = () => {
    pointerActiveRef.current = true;
  };

  const onPointerLeave = () => {
    pointerActiveRef.current = false;
    pendingRef.current = null;
    springX.set(0);
    springY.set(0);
    resetChars();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    pendingRef.current = { x: e.clientX, y: e.clientY };
    const el = wrapRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      springX.set(nx * 2 * PARALLAX_PX);
      springY.set(ny * 2 * PARALLAX_PX);
    }
    scheduleFlush();
  };

  if (reducedMotion) {
    return (
      <ContentSection className={clsx(styles.root, className)} ariaLabel={title ?? "Hero"}>
        <div className={styles.content}>
          {title && <h1 className={clsx("title-large", styles.title)}>{title}</h1>}
          {subtitle1 && <p className={clsx("body-large", styles.subtitle1)}>{subtitle1}</p>}
          {subtitle2 && <p className={clsx("body-large", styles.subtitle2)}>{subtitle2}</p>}
          {children}
        </div>
      </ContentSection>
    );
  }

  return (
    <ContentSection className={clsx(styles.root, className)} ariaLabel={title ?? "Hero"}>
      <motion.div
        ref={wrapRef}
        className={styles.content}
        style={{ x: springX, y: springY }}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {title && (
          <HeroLine text={title} className={clsx("title-large", styles.title)} as="h1" charClassName={styles.charTitle} />
        )}
        {subtitle1 && (
          <HeroLine
            text={subtitle1}
            className={clsx("body-large", styles.subtitle1)}
            as="p"
            charClassName={styles.charSubtitle}
          />
        )}
        {subtitle2 && (
          <HeroLine
            text={subtitle2}
            className={clsx("body-large", styles.subtitle2)}
            as="p"
            charClassName={styles.charSubtitle}
          />
        )}
        {children}
      </motion.div>
    </ContentSection>
  );
}
