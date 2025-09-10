import clsx from "clsx";
import styles from "./Text.module.scss";

type TextSize =
  | "large"
  | "largeStrong"
  | "largeAlt"
  | "largeStrongAlt"
  | "medium"
  | "mediumStrong"
  | "small"
  | "smallStrong";

type TextProps = React.PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements;
  size?: TextSize;
  muted?: boolean;
  className?: string;
}>;

export function Text({
  as: Element = "p",
  size = "medium",
  muted = false,
  className,
  children,
}: TextProps) {
  return (
    <Element
      className={clsx(
        styles.root,
        `body-${
          size === "large"
            ? "large"
            : size === "largeStrong"
            ? "large-strong"
            : size === "largeAlt"
            ? "large-alt"
            : size === "largeStrongAlt"
            ? "large-strong-alt"
            : size === "medium"
            ? "medium"
            : size === "mediumStrong"
            ? "medium-strong"
            : size === "small"
            ? "small"
            : "small-strong"
        }`,
        { [styles.muted]: muted },
        className
      )}
    >
      {children}
    </Element>
  );
}


