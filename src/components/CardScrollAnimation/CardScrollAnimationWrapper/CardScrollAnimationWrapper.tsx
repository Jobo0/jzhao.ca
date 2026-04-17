import {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
  Children,
  isValidElement,
  useId,
} from "react";
import type { ReactNode } from "react";
import { useScroll } from "framer-motion";
import { useRouter } from "next/router";
import AnimatedCard from "./AnimatedCard";
import styles from "./CardScrollAnimationWrapper.module.scss";

interface CardScrollAnimationWrapperProps {
  children: ReactNode;
  numFirstElements?: number;
  numLastElements?: number;
  bottomSeenOffsetPx?: number;
}

const CardScrollAnimationWrapper = ({
  children,
  numFirstElements = 0,
  numLastElements = 1,
  bottomSeenOffsetPx = 40,
}: CardScrollAnimationWrapperProps) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wrapperId = useId();
  const { pathname } = useRouter();
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const firstAnimatedIndex = Math.min(
    Math.max(numFirstElements, 0),
    childArray.length
  );
  const lastAnimatedIndex = Math.max(
    firstAnimatedIndex - 1,
    childArray.length - Math.max(numLastElements, 0) - 1
  );
  const hasAnimatedCards = firstAnimatedIndex <= lastAnimatedIndex;
  const [animationRanges, setAnimationRanges] = useState<
    Array<{
      start: number;
      end: number;
      reachViewport60: number;
      reachViewport30: number;
      enterStart: number;
      enterEnd: number;
      revealEnd: number;
      overhang: number;
      containerHeight: number;
      openTriggerProgress: number;
      closeTriggerProgress: number;
    }>
  >([]);
  const [stickyEnabled, setStickyEnabled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    let lastContainerHeight = -1;

    // `toggleSticky` controls whether the sticky-off/on remeasurement dance
    // runs. It is needed on the initial measurement (and on true window
    // resizes) but is skipped on `ResizeObserver`-driven recalcs so that
    // content reflows (images loading, address-bar show/hide) don't force a
    // full re-render of every card mid-scroll.
    const calculateRanges = (toggleSticky: boolean) => {
      if (!containerRef.current) return;

      const doCalc = () => {
        if (!containerRef.current) return;
        const containerEl = containerRef.current;
        const viewportHeight = window.innerHeight;

        const containerHeight =
          containerEl.scrollHeight - viewportHeight;
        lastContainerHeight = containerHeight;

        // Breakpoints are tuned per viewport so timing scales naturally across
        // screen sizes instead of inheriting fixed pixel values from old layouts.
        const enterLeadPx = clamp(viewportHeight * 0.28, 140, 340);

        const ranges = cardRefs.current.map((ref, index) => {
          if (!ref || containerHeight <= 0)
            return {
              start: 0,
              end: 0,
              reachViewport60: 0,
              reachViewport30: 0,
              enterStart: 0,
              enterEnd: 0,
              revealEnd: 0,
              overhang: 0,
              containerHeight: 0,
              openTriggerProgress: 0,
              closeTriggerProgress: 0,
            };

          const cardTop = ref.offsetTop;
          const nextCard = cardRefs.current[index + 1];
          const nextCardTop = nextCard
            ? nextCard.offsetTop
            : ref.offsetTop + ref.offsetHeight;

          const start = cardTop / containerHeight;
          const end = nextCardTop / containerHeight;
          const reachViewport60 = start - (viewportHeight * 0.6) / containerHeight;
          const reachViewport30 = start - (viewportHeight * 0.3) / containerHeight;

          // Entry starts before the card reaches the sticky anchor.
          const enterStart = start - enterLeadPx / containerHeight;

          // Entry ends when the card reaches the sticky anchor.
          const enterEnd = start;

          // Amount the card exceeds the viewport height.
          const rawOverhang = Math.max(0, ref.offsetHeight - window.innerHeight);

          // Positive offset means "consider bottom seen earlier" (less travel).
          // Negative offset means "consider bottom seen later" (more travel).
          const overhang = Math.max(0, rawOverhang - bottomSeenOffsetPx);

          // Normalized scroll progress that equals the overhang (1:1 scroll-to-translate).
          const overhangNormalized = overhang / containerHeight;

          // Translation ends after the scroll distance equal to overhang.
          const revealEnd = enterEnd + overhangNormalized;

          // Pre-computed scroll-progress thresholds equivalent to
          // `getBoundingClientRect().top <= vh*0.4` (open) and `> vh*0.6` (close),
          // so the scroll handler can decide open/close without forcing layout.
          const openTriggerProgress = start - (viewportHeight * 0.4) / containerHeight;
          const closeTriggerProgress = start - (viewportHeight * 0.6) / containerHeight;

          return {
            start,
            end,
            reachViewport60,
            reachViewport30,
            enterStart,
            enterEnd,
            revealEnd,
            overhang,
            containerHeight,
            openTriggerProgress,
            closeTriggerProgress,
          };
        });

        setAnimationRanges(ranges);
        if (toggleSticky) {
          requestAnimationFrame(() => {
            setStickyEnabled(true);
          });
        }
      };

      if (toggleSticky) {
        setStickyEnabled(false);
        // Defer to next frame so `.nonSticky` class is applied before measuring
        requestAnimationFrame(doCalc);
      } else {
        doCalc();
      }
    };

    if (!containerRef.current) return;
    const observedContainer = containerRef.current;

    // Initial calculation (requires the sticky-off/on dance)
    calculateRanges(true);

    // Debounced handler for window resize events
    const resizeTimeoutRef = { current: null as number | null };
    const observerTimeoutRef = { current: null as number | null };

    const handleResize = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        calculateRanges(true);
        resizeTimeoutRef.current = null;
      }, 100); // debounce delay
    };

    const handleLoad = () => calculateRanges(true);

    // Observe container size changes (covers images/fonts loading). Debounce
    // the callback and skip when height hasn't meaningfully changed, so mobile
    // address-bar resizes and minor reflows don't re-measure mid-scroll. We
    // also skip the sticky-toggle here to avoid a render storm during scroll.
    const resizeObserver = new ResizeObserver(() => {
      if (observerTimeoutRef.current !== null) {
        window.clearTimeout(observerTimeoutRef.current);
      }
      observerTimeoutRef.current = window.setTimeout(() => {
        observerTimeoutRef.current = null;
        if (!containerRef.current) return;
        const nextHeight =
          containerRef.current.scrollHeight - window.innerHeight;
        if (Math.abs(nextHeight - lastContainerHeight) < 1) return;
        calculateRanges(false);
      }, 100);
    });
    resizeObserver.observe(observedContainer);

    // Recalculate on viewport resize & when all resources have loaded
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleLoad);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      if (observerTimeoutRef.current !== null) {
        window.clearTimeout(observerTimeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleLoad);
    };
  }, [bottomSeenOffsetPx, childArray.length]);

  // Define a fallback range so that AnimatedCard always receives a full object
  const defaultRange: AnimationRange = {
    start: 0,
    end: 0,
    reachViewport60: 0,
    reachViewport30: 0,
    enterStart: 0,
    enterEnd: 0,
    revealEnd: 0,
    overhang: 0,
    containerHeight: 0,
    openTriggerProgress: 0,
    closeTriggerProgress: 0,
  };
  const firstAnimatedRange = hasAnimatedCards
    ? (animationRanges[firstAnimatedIndex] ?? defaultRange)
    : defaultRange;

  const childKeys = childArray.map((child, index) => {
    const stableChildKey = isValidElement(child) ? child.key : null;
    return stableChildKey === null ? String(index) : String(stableChildKey);
  });

  return (
    <div ref={containerRef} className={styles.cardContainer}>
      {childArray.map((child, index) => {
        // Use route + wrapper scope + stable child key so intro state survives remounts.
        // Fallback to index only if no key is available from Builder children.
        const introKey = `${pathname}:${wrapperId}:${childKeys[index]}`;

        const isLeadingStatic = index < firstAnimatedIndex;
        const isTrailingStatic = index >= childArray.length - numLastElements;
        const shouldAnimate = !isLeadingStatic && !isTrailingStatic;
        const isHero = isLeadingStatic && index === 0;

        return (
          <AnimatedCard
            key={childKeys[index]}
            refCb={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            isLast={isTrailingStatic}
            isLeadingStatic={isLeadingStatic}
            isSticky={isHero || shouldAnimate}
            stickyEnabled={stickyEnabled}
            isLastAnimated={shouldAnimate && index === lastAnimatedIndex}
            fadeOutStart={isHero ? firstAnimatedRange.reachViewport60 : undefined}
            fadeOutEnd={isHero ? firstAnimatedRange.reachViewport30 : undefined}
            stackOffsetPx={shouldAnimate && index > firstAnimatedIndex ? -80 : 0}
            range={animationRanges[index] ?? defaultRange}
            z={index}
            scrollYProgress={scrollYProgress}
            introKey={introKey}
            shouldAnimate={shouldAnimate}
          >
            {child}
          </AnimatedCard>
        );
      })}
    </div>
  );
};

// Expose this shape so AnimatedCard file can import it without circular deps
export interface AnimationRange {
  start: number;
  end: number;
  reachViewport60: number;
  reachViewport30: number;
  enterStart: number;
  enterEnd: number;
  revealEnd: number;
  overhang: number;
  containerHeight: number;
  openTriggerProgress: number;
  closeTriggerProgress: number;
}

export default CardScrollAnimationWrapper;
