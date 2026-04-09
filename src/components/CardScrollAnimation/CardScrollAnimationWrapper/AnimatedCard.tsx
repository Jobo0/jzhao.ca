import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  } = range;
  const prefersReducedMotion = useReducedMotion();
  const introControls = useAnimationControls();
  const sequenceInFlightRef = useRef(false);
  const isOpenRef = useRef(false);
  const runIntroSequenceRef = useRef<() => void>(() => {});
  const runCloseSequenceRef = useRef<() => void>(() => {});
  const prevProgressRef = useRef(scrollYProgress.get());
  const prevTopRef = useRef<number | null>(null);
  const introPreparedRef = useRef(false);
  const cardElRef = useRef<HTMLDivElement | null>(null);

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
  const getCardTop = useCallback(() => {
    const el = cardElRef.current;
    if (!el) return null;
    return el.getBoundingClientRect().top;
  }, []);
  const shouldBeOpenNow = useCallback(() => {
    const top = getCardTop();
    if (top === null) return false;
    const openTriggerY = window.innerHeight * 0.4;
    return top <= openTriggerY;
  }, [getCardTop]);
  const shouldBeClosedNow = useCallback(() => {
    const top = getCardTop();
    if (top === null) return false;
    const closeTriggerY = window.innerHeight * 0.6;
    return top > closeTriggerY;
  }, [getCardTop]);
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
  const safeEnterEnd = Math.max(enterEnd, enterStart + epsilon);
  const safeEnd = Math.max(end, safeEnterEnd + epsilon);
  const safeExitStart = Math.min(
    Math.max(Math.max(revealEnd, safeEnd - 0.08), safeEnterEnd + epsilon),
    safeEnd - epsilon
  );

  useEffect(() => {
    if (prefersReducedMotion || !shouldAnimate || sequenceInFlightRef.current) return;
    const el = cardElRef.current;
    if (!el) return;
    const openTriggerY = window.innerHeight * 0.4;
    const top = el.getBoundingClientRect().top;
    prevTopRef.current = top;

    if (top <= openTriggerY) {
      runIntroSequence();
    }
  }, [prefersReducedMotion, runIntroSequence, shouldAnimate]);

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

    // 3. Hold at full reveal until the next sticky card takes over.
    return -overhang;
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

  // ----- Opacity -----
  const eased = (value: number) => easeInOut(Math.min(1, Math.max(0, value)));
  const opacity = useTransform(scrollYProgress, (latest) => {
    if (!shouldAnimate) return 1;
    // Keep shell opacity stable through intro; only fade on exit.
    if (latest <= safeExitStart) return 1;
    if (latest < safeEnd) {
      const progress = (latest - safeExitStart) / (safeEnd - safeExitStart);
      return 1 - eased(progress);
    }
    return 0;
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = prevProgressRef.current;
    prevProgressRef.current = latest;

    if (prefersReducedMotion || !shouldAnimate) return;

    const el = cardElRef.current;
    if (!el) return;
    const openTriggerY = window.innerHeight * 0.4;
    const closeTriggerY = window.innerHeight * 0.6;
    const currentTop = el.getBoundingClientRect().top;
    const previousTop = prevTopRef.current ?? currentTop;
    prevTopRef.current = currentTop;

    const isDownward = latest > previous;
    const isUpward = latest < previous;
    const crossedIntoEntry =
      previousTop > openTriggerY && currentTop <= openTriggerY;
    const crossedBackAboveEntry =
      previousTop <= closeTriggerY && currentTop > closeTriggerY;

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
      ref={(el) => {
        cardElRef.current = el;
        refCb(el);
      }}
      style={{
        scale,
        y: 0,
        opacity,
        zIndex: z,
        marginTop: 0,
      }}
      className={cardClassName}
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
