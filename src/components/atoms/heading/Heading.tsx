import clsx from "clsx";
import styles from "./Heading.module.scss";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = React.PropsWithChildren<{
  level?: HeadingLevel;
  align?: "left" | "center" | "right";
  muted?: boolean;
  className?: string;
}>;

export function Heading({
  level = 2,
  align = "left",
  muted = false,
  className,
  children,
}: HeadingProps) {
  const Tag = (`h${level}` as unknown) as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag
      className={clsx(
        styles.root,
        `title-${
          level === 1
            ? "large"
            : level === 2
            ? "medium"
            : level === 3
            ? "small"
            : level === 4
            ? "small-alt"
            : level === 5
            ? "body-large-strong"
            : "body-medium-strong"
        }`,
        styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`],
        { [styles.muted]: muted },
        className
      )}
    >
      {children}
    </Tag>
  );
}


