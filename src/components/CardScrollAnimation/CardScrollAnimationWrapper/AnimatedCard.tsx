import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useTransform,
  easeOut,
  easeInOut,
  useAnimationControls,
  useMotionValueEvent,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import styles from "./CardScrollAnimationWrapper.module.scss";
import type { AnimationRange } from "./CardScrollAnimationWrapper";

interface AnimatedCardProps {
  children: ReactNode;
  refCb: (el: HTMLDivElement | null) => void;
  isLast: boolean;
  isLeadingStatic?: boolean;
  isSticky?: boolean;
  stickyEnabled?: boolean;
  isLastAnimated?: boolean;
  fadeOutStart?: number;
  fadeOutEnd?: number;
  stackOffsetPx?: number;
  shouldAnimate: boolean;
  range: AnimationRange;
  z: number;
  scrollYProgress: MotionValue<number>;
  introKey: string;
}

const AnimatedCard = ({
  children,
  refCb,
  isLast,
  isLeadingStatic = false,
  isSticky = false,
  stickyEnabled = true,
  isLastAnimated = false,
  fadeOutStart,
  fadeOutEnd,
  stackOffsetPx = 0,
  shouldAnimate,
  range,
  z,
  scrollYProgress,
  introKey,
}: AnimatedCardProps) => {
  const {
    enterStart,
    enterEnd,
    revealEnd,
    end,
    overhang,
    containerHeight,
    openTriggerProgress,
    closeTriggerProgress,
  } = range;
  const prefersReducedMotion = useReducedMotion();
  const introControls = useAnimationControls();
  const sequenceInFlightRef = useRef(false);
  const isOpenRef = useRef(false);
  const runIntroSequenceRef = useRef<() => void>(() => {});
  const runCloseSequenceRef = useRef<() => void>(() => {});
  const prevProgressRef = useRef(scrollYProgress.get());
  const introPreparedRef = useRef(false);
  // Track whether this card is currently within the exit-blur progress window
  // so we can conditionally attach the `filter` style and avoid promoting every
  // card to a permanent compositor layer for `blur(0px)`.
  const [isExitBlurring, setIsExitBlurring] = useState(false);
  // Release last animated card from sticky once it is fully revealed, so the
  // footer pushes it up naturally regardless of footer height vs. overhang.
  const [isReleased, setIsReleased] = useState(false);

  const hiddenIntroState = useMemo(
    () =>
      ({
        "--window-border-clip": 43,
        "--window-bg-opacity": 0,
        "--window-content-opacity": 0,
        "--window-content-blur": 7,
        "--window-content-y": 0,
      }) as const,
    []
  );
  const openIntroState = useMemo(
    () =>
      ({
        "--window-border-clip": 0,
        "--window-bg-opacity": 1,
        "--window-content-opacity": 1,
        "--window-content-blur": 0,
        "--window-content-y": 0,
      }) as const,
    []
  );
  const borderOpenTransition = useMemo(
    () => ({
      duration: 1.05,
      times: [0, 0.42, 1] as number[],
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    }),
    []
  );
  const borderCloseTransition = useMemo(
    () => ({
      duration: 0.52,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }),
    []
  );
  const backgroundOpenTransition = useMemo(
    () => ({
      duration: 0.32,
      ease: "easeOut" as const,
    }),
    []
  );
  const backgroundCloseTransition = useMemo(
    () => ({
      duration: 0.26,
      ease: "easeOut" as const,
    }),
    []
  );
  const contentOpenTransition = useMemo(
    () => ({
      duration: 0.14,
      times: [0, 0.34, 0.68, 1] as number[],
      ease: "easeInOut" as const,
    }),
    []
  );
  const contentCloseTransition = useMemo(
    () => ({
      duration: 0.14,
      times: [0, 0.6, 1] as number[],
      ease: "easeInOut" as const,
    }),
    []
  );
  // Evaluate open/close state from the scroll progress value instead of
  // `getBoundingClientRect`, which would force a synchronous layout. The
  // trigger thresholds are pre-computed per card in `calculateRanges()`.
  const shouldBeOpenNow = useCallback(() => {
    return scrollYProgress.get() >= openTriggerProgress;
  }, [openTriggerProgress, scrollYProgress]);
  const shouldBeClosedNow = useCallback(() => {
    return scrollYProgress.get() < closeTriggerProgress;
  }, [closeTriggerProgress, scrollYProgress]);
  const runBorderOpenPhase = useCallback(
    () =>
      introControls.start({
        "--window-border-clip": [43, 43, 0],
        "--window-bg-opacity": 0,
        "--window-content-opacity": 0,
        transition: borderOpenTransition,
      }),
    [borderOpenTransition, introControls]
  );
  const runBorderClosePhase = useCallback(
    () =>
      introControls.start({
        "--window-border-clip": [0, 43],
        transition: borderCloseTransition,
      }),
    [borderCloseTransition, introControls]
  );
  const runBackgroundOpenPhase = useCallback(
    () =>
      introControls.start({
        "--window-bg-opacity": [0, 1],
        transition: backgroundOpenTransition,
      }),
    [backgroundOpenTransition, introControls]
  );
  const runBackgroundClosePhase = useCallback(
    () =>
      introControls.start({
        "--window-bg-opacity": [1, 0],
        transition: backgroundCloseTransition,
      }),
    [backgroundCloseTransition, introControls]
  );
  const runContentOpenPhase = useCallback(
    () =>
      introControls.start({
        "--window-content-opacity": [0, 1, 0.75, 1],
        "--window-content-blur": [3, 0, 1, 0],
        "--window-content-y": 0,
        transition: contentOpenTransition,
      }),
    [contentOpenTransition, introControls]
  );
  const runContentClosePhase = useCallback(
    () =>
      introControls.start({
        "--window-content-opacity": [1, 0.2, 0],
        "--window-content-blur": [0, 1, 3],
        "--window-content-y": 0,
        transition: contentCloseTransition,
      }),
    [contentCloseTransition, introControls]
  );

  useEffect(() => {
    const showContent = prefersReducedMotion || !shouldAnimate;
    if (showContent) {
      introControls.set(openIntroState);
      introPreparedRef.current = true;
      isOpenRef.current = true;
      return;
    }

    introControls.set(hiddenIntroState);
    introPreparedRef.current = false;
    isOpenRef.current = false;
  }, [
    hiddenIntroState,
    introControls,
    openIntroState,
    prefersReducedMotion,
    shouldAnimate,
  ]);

  const runIntroSequence = useCallback(() => {
    if (
      prefersReducedMotion ||
      !shouldAnimate ||
      sequenceInFlightRef.current ||
      isOpenRef.current
    ) {
      return;
    }

    sequenceInFlightRef.current = true;
    introControls.set(hiddenIntroState);

    void (async () => {
      try {
        await runBorderOpenPhase();

        // Midway guard: if user already scrolled back up, reverse only the border.
        if (shouldBeClosedNow()) {
          await runBorderClosePhase();
          introPreparedRef.current = false;
          isOpenRef.current = false;
          window.requestAnimationFrame(() => {
            if (sequenceInFlightRef.current || isOpenRef.current) return;
            if (shouldBeOpenNow()) {
              runIntroSequenceRef.current();
            }
          });
          return;
        }

        await runBackgroundOpenPhase();
        await runContentOpenPhase();

        introPreparedRef.current = true;
        isOpenRef.current = true;

        window.requestAnimationFrame(() => {
          if (sequenceInFlightRef.current || !isOpenRef.current) return;
          if (shouldBeClosedNow()) {
            runCloseSequenceRef.current();
          }
        });
      } finally {
        sequenceInFlightRef.current = false;
      }
    })();
  }, [
    hiddenIntroState,
    prefersReducedMotion,
    runBackgroundOpenPhase,
    runBorderClosePhase,
    runBorderOpenPhase,
    runContentOpenPhase,
    shouldAnimate,
    shouldBeClosedNow,
    shouldBeOpenNow,
    introControls,
  ]);

  const runCloseSequence = useCallback(() => {
    if (
      prefersReducedMotion ||
      !shouldAnimate ||
      sequenceInFlightRef.current ||
      !isOpenRef.current
    ) {
      return;
    }

    sequenceInFlightRef.current = true;

    void (async () => {
      try {
        await runContentClosePhase();

        // Midway guard (symmetric with open path): if user scrolled back into
        // open territory, abort deeper closing and reopen the window layer.
        if (shouldBeOpenNow()) {
          await runBackgroundOpenPhase();
          introPreparedRef.current = true;
          isOpenRef.current = true;
          window.requestAnimationFrame(() => {
            if (sequenceInFlightRef.current || !isOpenRef.current) return;
            if (shouldBeClosedNow()) {
              runCloseSequenceRef.current();
            }
          });
          return;
        }

        await runBackgroundClosePhase();
        await runBorderClosePhase();

        introPreparedRef.current = false;
        isOpenRef.current = false;
        window.requestAnimationFrame(() => {
          if (sequenceInFlightRef.current || isOpenRef.current) return;
          if (shouldBeOpenNow()) {
            runIntroSequenceRef.current();
          }
        });
      } finally {
        sequenceInFlightRef.current = false;
      }
    })();
  }, [
    runBackgroundOpenPhase,
    prefersReducedMotion,
    runBackgroundClosePhase,
    runBorderClosePhase,
    runContentClosePhase,
    shouldAnimate,
    shouldBeClosedNow,
    shouldBeOpenNow,
  ]);

  useEffect(() => {
    runIntroSequenceRef.current = runIntroSequence;
    runCloseSequenceRef.current = runCloseSequence;
  }, [runCloseSequence, runIntroSequence]);

  const scale = 1;
  const epsilon = 0.0001;
  const parallaxFactor = 0.2;
  const parallaxTransitionPx = 296;
  const safeEnterEnd = Math.max(enterEnd, enterStart + epsilon);
  const safeEnd = Math.max(end, safeEnterEnd + epsilon);
  const safeExitStart = Math.min(
    Math.max(revealEnd + 0.02, safeEnterEnd + epsilon),
    safeEnd - epsilon
  );
  const hasFadeRange =
    fadeOutStart !== undefined &&
    fadeOutEnd !== undefined &&
    fadeOutEnd > fadeOutStart;

  useEffect(() => {
    if (prefersReducedMotion || !shouldAnimate || sequenceInFlightRef.current) return;
    if (containerHeight === 0) return;

    if (scrollYProgress.get() >= openTriggerProgress) {
      runIntroSequence();
    }
  }, [
    containerHeight,
    openTriggerProgress,
    prefersReducedMotion,
    runIntroSequence,
    scrollYProgress,
    shouldAnimate,
  ]);

  // ----- Base Y (translateY) -----
  const baseY = useTransform(scrollYProgress, (latest) => {
    if (isLast || containerHeight === 0) return 0;

    // 1. Card entering - pinned in place
    if (latest < safeEnterEnd) return 0;

    // 2. Reveal the bottom of the card by translating exactly the overhang amount
    if (latest < revealEnd && revealEnd > safeEnterEnd) {
      const progress = (latest - safeEnterEnd) / (revealEnd - safeEnterEnd);
      return -progress * overhang;
    }

    // 3. After full reveal, non-final animated cards continue with a smooth
    // parallax drift (velocity ratio eases 1.0 -> 0.2 over 296px).
    if (!isLastAnimated) {
      const scrollPx = Math.max(0, (latest - revealEnd) * containerHeight);

      if (scrollPx <= parallaxTransitionPx) {
        const displacement =
          scrollPx -
          ((1 - parallaxFactor) * scrollPx * scrollPx) /
            (2 * parallaxTransitionPx);
        return -overhang - displacement;
      }

      const precomputedOffset =
        (parallaxTransitionPx * (1 + parallaxFactor)) / 2;
      return (
        -overhang -
        precomputedOffset -
        (scrollPx - parallaxTransitionPx) * parallaxFactor
      );
    }

    // 4. Final animated card: hold at full reveal while still sticky; once
    // released into normal flow, reset translate so the footer push-up stays
    // visually continuous (see plan: sticky + (-O) and non-sticky + 0 both
    // evaluate to visual top = -O at the release boundary).
    return isReleased ? 0 : -overhang;
  });

  // ----- Presentation Y: small settle movement during entry -----
  const presentationYInput = [enterStart, safeEnterEnd];
  const presentationYOutput = [10, 0];
  const presentationY = useTransform(
    scrollYProgress,
    presentationYInput,
    presentationYOutput,
    { ease: easeOut }
  );
  const composedY = useTransform([baseY, presentationY], (latest) => {
    const [base, extra] = latest as number[];
    return base + extra;
  });
  const depthProgress = useTransform(scrollYProgress, (latest) => {
    if (
      prefersReducedMotion ||
      !shouldAnimate ||
      isLast ||
      isLastAnimated ||
      containerHeight === 0
    ) {
      return 0;
    }

    if (latest <= revealEnd) return 0;

    const scrollPx = Math.max(0, (latest - revealEnd) * containerHeight);
    if (scrollPx <= parallaxTransitionPx) {
      return Math.min(1, scrollPx / parallaxTransitionPx);
    }
    return 1;
  });
  const depthScale = useTransform(depthProgress, (progress) => 1 - progress * 0.05);
  const depthTiltX = useTransform(depthProgress, (progress) => progress * 3);

  // ----- Opacity -----
  const eased = (value: number) => easeInOut(Math.min(1, Math.max(0, value)));
  const opacity = useTransform(scrollYProgress, (latest) => {
    if (hasFadeRange) {
      if (latest <= fadeOutStart) return 1;
      if (latest < fadeOutEnd) {
        const progress = (latest - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        return 1 - eased(progress);
      }
      return 0;
    }

    if (isLastAnimated) return 1;
    if (!shouldAnimate) return 1;
    // Keep shell opacity stable through intro; only fade on exit.
    if (latest <= safeExitStart) return 1;
    if (latest < safeEnd) {
      const progress = (latest - safeExitStart) / (safeEnd - safeExitStart);
      return 1 - eased(progress);
    }
    return 0;
  });
  const exitBlurPx = useTransform(scrollYProgress, (latest) => {
    if (!shouldAnimate || hasFadeRange || isLastAnimated) return 0;
    if (latest <= safeExitStart) return 0;
    if (latest < safeEnd) {
      const progress = (latest - safeExitStart) / (safeEnd - safeExitStart);
      return eased(progress) * 6;
    }
    return 6;
  });
  const exitBlurFilter = useMotionTemplate`blur(${exitBlurPx}px)`;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = prevProgressRef.current;
    prevProgressRef.current = latest;

    // Flip the sticky-release flag for the last animated card around revealEnd.
    // Hysteresis avoids rapid toggling from sub-pixel scroll jitter at the
    // exact boundary.
    if (isLastAnimated) {
      const releaseHysteresis = 0.0005;
      if (!isReleased && latest > revealEnd + releaseHysteresis) {
        setIsReleased(true);
      } else if (isReleased && latest < revealEnd - releaseHysteresis) {
        setIsReleased(false);
      }
    }

    // Only attach the `filter: blur(...)` style while actually inside the exit
    // blur range. Outside of it, the filter prop is omitted so the card is not
    // permanently promoted to a GPU filter layer.
    if (shouldAnimate && !hasFadeRange && !isLastAnimated) {
      const inBlurWindow = latest > safeExitStart && latest < safeEnd;
      if (inBlurWindow && !isExitBlurring) {
        setIsExitBlurring(true);
      } else if (!inBlurWindow && isExitBlurring) {
        setIsExitBlurring(false);
      }
    } else if (isExitBlurring) {
      setIsExitBlurring(false);
    }

    if (prefersReducedMotion || !shouldAnimate) return;

    // Open/close crossings are evaluated purely from scroll progress, using
    // thresholds pre-computed per card. This avoids a forced-layout
    // `getBoundingClientRect` read on every scroll tick.
    const isDownward = latest > previous;
    const isUpward = latest < previous;
    const crossedIntoEntry =
      previous < openTriggerProgress && latest >= openTriggerProgress;
    const crossedBackAboveEntry =
      previous >= closeTriggerProgress && latest < closeTriggerProgress;

    if (isDownward && crossedIntoEntry) {
      runIntroSequence();
      return;
    }

    if (isUpward && crossedBackAboveEntry) {
      runCloseSequence();
    }
  });

  const cardClassName = isLeadingStatic
    ? styles.leadingStaticCard
    : isLast
      ? styles.lastCard
      : styles.card;
  const stickyClassName = isSticky
    ? stickyEnabled && !(isLastAnimated && isReleased)
      ? styles.stickyCard
      : styles.nonSticky
    : "";
  const introStyle: CSSProperties = prefersReducedMotion || !shouldAnimate
    ? ({
        "--window-border-clip": 0,
        "--window-bg-opacity": 1,
        "--window-content-opacity": 1,
        "--window-content-blur": 0,
        "--window-content-y": 0,
      } as CSSProperties)
    : ({
        "--window-border-clip": 43,
        "--window-bg-opacity": 0,
        "--window-content-opacity": 0,
        "--window-content-blur": 7,
        "--window-content-y": 0,
      } as CSSProperties);

  return (
    <motion.div
      ref={refCb}
      style={{
        scale: depthScale,
        y: shouldAnimate ? composedY : 0,
        transformPerspective: 1200,
        rotateX: depthTiltX,
        opacity,
        // Only attach `filter` while actively blurring during exit. Omitting it
        // entirely (rather than using `blur(0px)`) avoids a persistent GPU
        // filter layer on every card.
        ...(shouldAnimate && !hasFadeRange && isExitBlurring
          ? { filter: exitBlurFilter }
          : {}),
        zIndex: z,
        marginTop: stackOffsetPx,
      }}
      className={`${cardClassName} ${stickyClassName}`}
    >
      <div className={styles.cardInner}>
        <motion.div
          className={styles.contentRevealLayer}
          style={introStyle}
          animate={introControls}
          initial={false}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
