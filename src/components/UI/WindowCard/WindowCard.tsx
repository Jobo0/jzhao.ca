"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import styles from "./WindowCard.module.scss";

export type WindowCardProps = {
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const PARALLAX_PX = 5;
const springOpts = { stiffness: 84, damping: 28, mass: 0.55 };

const WindowCard = ({ children, className, ariaLabel }: WindowCardProps) => {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const springX = useSpring(0, springOpts);
  const springY = useSpring(0, springOpts);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    springX.set(nx * 2 * PARALLAX_PX);
    springY.set(ny * 2 * PARALLAX_PX);
  };

  const onPointerLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  if (reducedMotion) {
    return (
      <div className={clsx(styles.root, className)} aria-label={ariaLabel} role="group">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={wrapRef}
      className={clsx(styles.root, styles.parallaxRoot, className)}
      aria-label={ariaLabel}
      role="group"
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
};

export default WindowCard;
