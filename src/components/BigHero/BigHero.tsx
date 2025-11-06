import React from "react";
import styles from "./BigHero.module.scss";
import ContentSection from "@/components/UI/ContentSection/ContentSection";

export type BigHeroProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function BigHero({ title, subtitle, children, className }: BigHeroProps) {
  return (
    <ContentSection className={`${styles.root} ${className ?? ""}`} ariaLabel={title ?? "Hero"}>
        <div className={styles.content}>
            {title && <h1 className={`title-large ${styles.title}`}>{title}</h1>}
            {subtitle && <p className={`body-large ${styles.subtitle}`}>{subtitle}</p>}
            {children}
        </div>

    </ContentSection>
  );
}
