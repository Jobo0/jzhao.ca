import {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
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
}

const CardScrollAnimationWrapper = ({
  children,
  numFirstElements = 0,
  numLastElements = 1,
}: CardScrollAnimationWrapperProps) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wrapperId = useId();
  const { pathname } = useRouter();
  const childArray = Children.toArray(children);
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
    }>
  >([]);
  const [stickyEnabled, setStickyEnabled] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const calculateRanges = () => {
      if (!containerRef.current) return;

      const doCalc = () => {
        if (!containerRef.current) return;

        const containerHeight =
          containerRef.current.scrollHeight - window.innerHeight;
        const viewportHeight = window.innerHeight;

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

          // Amount the card exceeds the viewport height. This distance will be
          // used to translate the sticky card upwards so the bottom of the card
          // can scroll into view before the next animation phase.
          const overhang = Math.max(0, ref.offsetHeight - window.innerHeight);

          // Normalized scroll progress that equals the overhang (1:1 scroll-to-translate).
          const overhangNormalized = overhang / containerHeight;

          // Translation ends after the scroll distance equal to overhang.
          const revealEnd = enterEnd + overhangNormalized;

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
          };
        });

        setAnimationRanges(ranges);
        requestAnimationFrame(() => {
          setStickyEnabled(true);
        });
      };

      setStickyEnabled(false);
      // Defer to next frame so `.nonSticky` class is applied before measuring
      requestAnimationFrame(doCalc);
    };

    if (!containerRef.current) return;

    // Initial calculation
    calculateRanges();

    // Observe container size changes (covers images/fonts loading)
    const resizeObserver = new ResizeObserver(() => {
      calculateRanges();
    });
    resizeObserver.observe(containerRef.current);

    // Debounced handler for window resize events
    const resizeTimeoutRef = { current: null as number | null };

    const handleResize = () => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        calculateRanges();
        resizeTimeoutRef.current = null;
      }, 100); // debounce delay
    };

    // Recalculate on viewport resize & when all resources have loaded
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", calculateRanges);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", calculateRanges);
    };
  }, [childArray.length]);

  useEffect(() => {
    // Staged/snap-like scroll interception disabled: use native page scroll.
    return undefined;
  }, [firstAnimatedIndex, hasAnimatedCards, lastAnimatedIndex]);

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
            key={index}
            refCb={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            isLast={isTrailingStatic}
            isLeadingStatic={isLeadingStatic}
            isSticky={isHero}
            stickyEnabled={stickyEnabled}
            fadeOutStart={isHero ? firstAnimatedRange.reachViewport60 : undefined}
            fadeOutEnd={isHero ? firstAnimatedRange.reachViewport30 : undefined}
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
}

export default CardScrollAnimationWrapper;
