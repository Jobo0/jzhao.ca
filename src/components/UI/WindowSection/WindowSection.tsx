import React from "react";
import clsx from "clsx";
import styles from "./WindowSection.module.scss";

export type WindowSectionProps = {
  children?: React.ReactNode;
  className?: string;
  /** Adds an outer max-width container around the window */
  useContainer?: boolean;
  /** Content padding inside the window */
  padding?: "none" | "sm" | "md" | "lg";
  /** Corner radius scale */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Surface look */
  surface?: "default" | "raised" | "tinted";
  /** Toggle border */
  bordered?: boolean;
  /** Highlighted state adds a glowing/highlight border for emphasis/animation */
  highlighted?: boolean;
  /** Flex direction for content */
  direction?: "column" | "row";
  /** Cross-axis alignment when using flex */
  align?: "start" | "center" | "end";
  /** Optional header slot rendered above body (inside frame) */
  header?: React.ReactNode;
  /** Optional footer slot rendered below body (inside frame) */
  footer?: React.ReactNode;
  /** ARIA label for the section */
  ariaLabel?: string;
};

export default function WindowSection({
  children,
  className,
  useContainer = true,
  padding = "md",
  radius = "md",
  surface = "default",
  bordered = true,
  highlighted = false,
  direction = "column",
  align = "start",
  header,
  footer,
  ariaLabel,
}: WindowSectionProps) {
  const paddingClass =
    padding === "none"
      ? styles.paddingNone
      : padding === "sm"
      ? styles.paddingSm
      : padding === "lg"
      ? styles.paddingLg
      : styles.paddingMd;

  const radiusClass =
    radius === "sm"
      ? styles.radiusSm
      : radius === "lg"
      ? styles.radiusLg
      : radius === "xl"
      ? styles.radiusXl
      : styles.radiusMd;

  const surfaceClass =
    surface === "raised"
      ? styles.surfaceRaised
      : surface === "tinted"
      ? styles.surfaceTinted
      : styles.surfaceDefault;

  const alignClass =
    align === "center"
      ? styles.alignCenter
      : align === "end"
      ? styles.alignEnd
      : styles.alignStart;

  const directionClass =
    direction === "row" ? styles.contentRow : styles.contentColumn;

  const frameClasses = clsx(
    styles.window,
    styles.grain,
    paddingClass,
    radiusClass,
    surfaceClass,
    bordered ? styles.withBorder : styles.noBorder,
    highlighted && styles.highlighted,
    alignClass,
    directionClass,
    className
  );

  const content = (
    <div className={frameClasses} role="group">
      {header ? <div className={styles.header}>{header}</div> : null}
      <div className={styles.body}>{children}</div>
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );

  return (
    <section className={styles.root} aria-label={ariaLabel} role="region">
      {useContainer ? (
        <div className={styles.container}>{content}</div>
      ) : (
        content
      )}
    </section>
  );
}


