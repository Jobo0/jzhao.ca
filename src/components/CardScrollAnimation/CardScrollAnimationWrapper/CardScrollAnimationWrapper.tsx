import {
  useRef,
  useState,
  useLayoutEffect,
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
  numLastElements?: number;
}

const CardScrollAnimationWrapper = ({
  children,
  numLastElements = 1,
}: CardScrollAnimationWrapperProps) => {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wrapperId = useId();
  const { pathname } = useRouter();
  const [animationRanges, setAnimationRanges] = useState<
    Array<{
      start: number;
      end: number;
      disappearEnd: number;
      emergeStart: number;
      emergeEnd: number;
      shrinkStart: number;
      revealEnd: number;
      overhang: number;
      containerHeight: number;
    }>
  >([]);
  const [isMeasuring, setIsMeasuring] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const calculateRanges = () => {
      if (!containerRef.current) return;
      setIsMeasuring(true);

      const doCalc = () => {
        if (!containerRef.current) return;

        const lastCardEl = cardRefs.current[cardRefs.current.length - 1];
        if (lastCardEl) {
          // Ensure we always reset the padding / margin so values don't become stale
          const padding = Math.max(
            0,
            window.innerHeight - lastCardEl.offsetHeight
          );
          containerRef.current.style.paddingBottom = `${padding}px`;
          containerRef.current.style.marginBottom = `-${padding}px`;
        }

        const containerHeight =
          containerRef.current.scrollHeight - window.innerHeight;
        const viewportHeight = window.innerHeight;

        // Breakpoints are tuned per viewport so timing scales naturally across
        // screen sizes instead of inheriting fixed pixel values from old layouts.
        const emergeLeadPx = clamp(viewportHeight * 0.32, 180, 380);
        const disappearTailPx = clamp(viewportHeight * 0.18, 96, 220);
        const shrinkLeadPx = clamp(viewportHeight * 0.35, 180, 420);

        const ranges = cardRefs.current.map((ref, index) => {
          if (!ref || containerHeight <= 0)
            return {
              start: 0,
              end: 0,
              disappearEnd: 0,
              emergeStart: 0,
              emergeEnd: 0,
              shrinkStart: 0,
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

          // Emerge starts when the top of the previous card hits the top of the viewport.
          const emergeStart = start - emergeLeadPx / containerHeight;

          // Emerge ends when the card reaches the sticky anchor.
          const emergeEnd = start;

          // Keep the card visible slightly beyond the main handoff.
          const disappearEnd = end + disappearTailPx / containerHeight;

          // Amount the card exceeds the viewport height. This distance will be
          // used to translate the sticky card upwards so the bottom of the card
          // can scroll into view before the next animation phase.
          const overhang = Math.max(0, ref.offsetHeight - window.innerHeight);

          // Normalized scroll progress that equals the overhang (1:1 scroll-to-translate).
          const overhangNormalized = overhang / containerHeight;

          // Translation ends after the scroll distance equal to overhang.
          const revealEnd = emergeEnd + overhangNormalized;

          // Exit starts before the end, scaled to viewport size.
          const shrinkStartRaw = end - shrinkLeadPx / containerHeight;
          // Ensure shrink does not start before we've finished revealing the card bottom.
          const shrinkStart = Math.max(shrinkStartRaw, revealEnd);

          return {
            start,
            end,
            disappearEnd,
            emergeStart,
            emergeEnd,
            shrinkStart,
            revealEnd,
            overhang,
            containerHeight,
          };
        });

        setAnimationRanges(ranges);
        setIsMeasuring(false);
      };

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
  }, []);

  // Define a fallback range so that AnimatedCard always receives a full object
  const defaultRange: AnimationRange = {
    start: 0,
    end: 0,
    disappearEnd: 0,
    emergeStart: 0,
    emergeEnd: 0,
    shrinkStart: 0,
    revealEnd: 0,
    overhang: 0,
    containerHeight: 0,
  };

  const childArray = Children.toArray(children);
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

        return (
          <AnimatedCard
            key={index}
            refCb={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            isLast={index >= childArray.length - numLastElements}
            range={animationRanges[index] ?? defaultRange}
            z={index}
            scrollYProgress={scrollYProgress}
            stickyEnabled={
              !isMeasuring && (animationRanges[index]?.containerHeight ?? 0) > 0
            }
            introKey={introKey}
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
  disappearEnd: number;
  emergeStart: number;
  emergeEnd: number;
  shrinkStart: number;
  revealEnd: number;
  overhang: number;
  containerHeight: number;
}

export default CardScrollAnimationWrapper;
