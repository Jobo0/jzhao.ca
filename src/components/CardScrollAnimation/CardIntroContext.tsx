import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";

interface CardIntroContextValue {
  hasPlayed: (key: string) => boolean;
  markPlayed: (key: string) => void;
}

const CardIntroContext = createContext<CardIntroContextValue | null>(null);
const fallbackCardIntroContext: CardIntroContextValue = {
  hasPlayed: () => false,
  markPlayed: () => {},
};

export const CardIntroProvider = ({ children }: PropsWithChildren) => {
  const playedRef = useRef<Set<string>>(new Set());

  const hasPlayed = useCallback((key: string) => {
    return playedRef.current.has(key);
  }, []);

  const markPlayed = useCallback((key: string) => {
    playedRef.current.add(key);
  }, []);

  const value = useMemo(
    () => ({
      hasPlayed,
      markPlayed,
    }),
    [hasPlayed, markPlayed]
  );

  return (
    <CardIntroContext.Provider value={value}>{children}</CardIntroContext.Provider>
  );
};

export const useCardIntro = (): CardIntroContextValue => {
  const context = useContext(CardIntroContext);

  if (!context) {
    // Allow isolated renders (e.g. editors/previews) without crashing.
    return fallbackCardIntroContext;
  }

  return context;
};
