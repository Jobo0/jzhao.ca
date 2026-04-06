import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useTransform,
  easeOut,
  easeIn,
  useAnimationControls,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import styles from "./CardScrollAnimationWrapper.module.scss";
import type { AnimationRange } from "./CardScrollAnimationWrapper";
import { useCardIntro } from "../CardIntroContext";

interface AnimatedCardProps {
  children: ReactNode;
  refCb: (el: HTMLDivElement | null) => void;
  isLast: boolean;
  range: AnimationRange;
  z: number;
  scrollYProgress: MotionValue<number>;
  stickyEnabled?: boolean;
  introKey: string;
}

const AnimatedCard = ({
  children,
  refCb,
  isLast,
  range,
  z,
  scrollYProgress,
  stickyEnabled = true,
  introKey,
}: AnimatedCardProps) => {
  const {
    emergeStart,
    emergeEnd,
    shrinkStart,
    revealEnd,
    end,
    disappearEnd,
    overhang,
    containerHeight,
  } = range;
  const { hasPlayed, markPlayed } = useCardIntro();
  const prefersReducedMotion = useReducedMotion();
  const blinkControls = useAnimationControls();
  const introPlayedRef = useRef(hasPlayed(introKey));
  const blinkInFlightRef = useRef(false);
  const prevProgressRef = useRef(scrollYProgress.get());

  useEffect(() => {
    introPlayedRef.current = hasPlayed(introKey);
  }, [hasPlayed, introKey]);

  const easing = [easeOut, easeOut, easeIn, easeOut];

  // ----- Scale -----
  const scaleInput = isLast
    ? [emergeStart, emergeEnd]
    : [emergeStart, emergeEnd, shrinkStart, end, disappearEnd];
  const scaleOutput = isLast ? [0.99, 1] : [0.99, 1, 1, 0.98, 0.965];
  const scale = useTransform(scrollYProgress, scaleInput, scaleOutput, {
    ease: isLast ? easeOut : easing,
  });

  // ----- Base Y (translateY) -----
  const baseY = useTransform(scrollYProgress, (latest) => {
    if (isLast || containerHeight === 0) return 0;

    // 1. Card emerging - pinned in place
    if (latest < emergeEnd) return 0;

    // 2. Reveal the bottom of the card by translating exactly the overhang amount
    if (latest < revealEnd) {
      const progress = (latest - emergeEnd) / (revealEnd - emergeEnd);
      return -progress * overhang;
    }

    // 3. Parallax section – smoothly transition the scroll ratio from 1 → 0.2 over `transitionPx`
    const scrollPx = (latest - revealEnd) * containerHeight; // pixels scrolled past revealEnd

    const parallaxFactor = 0.2; // final ratio after transition
    // Keep transition proportional to section length so it remains consistent
    // after breakpoint retuning in the wrapper.
    const transitionPx = Math.max(
      120,
      Math.min(320, containerHeight * 0.12)
    );

    if (scrollPx <= transitionPx) {
      // Ratio decreases linearly from 1 to parallaxFactor across the transition distance
      // Integral of the varying ratio gives smooth displacement:
      // displacement = scrollPx - (1 - parallaxFactor) * scrollPx^2 / (2 * transitionPx)
      const easedTranslation =
        -overhang -
        (scrollPx -
          ((1 - parallaxFactor) * (scrollPx * scrollPx)) / (2 * transitionPx));
      return easedTranslation;
    }

    // After the transition distance, continue at constant parallaxFactor
    const precomputedOffset = (transitionPx * (1 + parallaxFactor)) / 2; // integral over the transition segment
    return (
      -overhang - precomputedOffset - (scrollPx - transitionPx) * parallaxFactor
    );
  });

  // ----- Presentation Y: mirror emerge/exit on top of sticky math -----
  const presentationYInput = isLast
    ? [emergeStart, emergeEnd]
    : [emergeStart, emergeEnd, shrinkStart, disappearEnd];
  const presentationYOutput = isLast ? [18, 0] : [18, 0, 0, -28];
  const presentationY = useTransform(
    scrollYProgress,
    presentationYInput,
    presentationYOutput,
    { ease: isLast ? easeOut : [easeOut, easeOut, easeIn] }
  );
  const composedY = useTransform([baseY, presentationY], (latest) => {
    const [base, extra] = latest as number[];
    return base + extra;
  });

  // ----- Opacity -----
  const opacityInput = isLast
    ? [emergeStart, emergeEnd]
    : [emergeStart, emergeEnd, shrinkStart, end, disappearEnd];
  // Keep cards fully readable before/through emerge; reserve dimming for exit.
  const opacityOutput = isLast ? [1, 1] : [1, 1, 1, 0.8, 0.62];
  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput, {
    ease: isLast ? easeOut : easing,
  });

  useEffect(() => {
    blinkControls.set({ opacity: 0 });
  }, [blinkControls]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = prevProgressRef.current;
    prevProgressRef.current = latest;

    if (isLast || prefersReducedMotion) return;

    const isDownward = latest > previous;
    const crossedIntoEmerge = previous < emergeStart && latest >= emergeStart;

    if (!isDownward || !crossedIntoEmerge) return;

    if (introPlayedRef.current || blinkInFlightRef.current) return;

    blinkInFlightRef.current = true;
    introPlayedRef.current = true;
    markPlayed(introKey);

    void blinkControls
      .start({
        opacity: [0, 0.9, 0.15, 1, 0],
        transition: {
          duration: 0.36,
          ease: "easeInOut",
          times: [0, 0.2, 0.45, 0.7, 1],
        },
      })
      .finally(() => {
        blinkInFlightRef.current = false;
      });
  });

  const cardClassName = isLast ? styles.lastCard : styles.card;
  const composedClassName = stickyEnabled
    ? cardClassName
    : `${cardClassName} ${styles.nonSticky}`;

  return (
    <motion.div
      ref={refCb}
      style={{
        scale,
        y: stickyEnabled ? composedY : 0,
        opacity,
        zIndex: z,
        marginTop: z > 0 ? "-36px" : 0,
      }}
      className={composedClassName}
    >
      <div className={styles.cardInner}>
        {children}
        {!prefersReducedMotion ? (
          <motion.div
            className={styles.hudBlinkOverlay}
            animate={blinkControls}
            initial={{ opacity: 0 }}
            aria-hidden
          />
        ) : null}
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
