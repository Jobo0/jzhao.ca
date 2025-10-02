import { type ReactNode } from "react";
import clsx from "clsx";
import styles from "./ContentSection.module.scss";

export type ContentSectionProps = {
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const ContentSection = ({ children, className, ariaLabel }: ContentSectionProps) => {
  return (
    <section className={clsx(styles.root, className)} aria-label={ariaLabel} role="region">
      {children}
    </section>
  );
};

export default ContentSection;



