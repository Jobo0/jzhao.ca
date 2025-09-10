import clsx from "clsx";
import styles from "./Badge.module.scss";

type BadgeTone = "neutral" | "accent" | "success" | "error";
type BadgeVariant = "solid" | "soft" | "outline";
type BadgeSize = "sm" | "md";

type BadgeProps = React.PropsWithChildren<{
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
  className?: string;
}>;

export function Badge({
  tone = "neutral",
  variant = "soft",
  size = "md",
  pill = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        styles.root,
        styles[size],
        styles[variant],
        styles[`tone${tone.charAt(0).toUpperCase() + tone.slice(1)}`],
        { [styles.pill]: pill },
        className
      )}
    >
      {children}
    </span>
  );
}


