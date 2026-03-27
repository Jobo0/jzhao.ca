import React from "react";
import styles from "./BigHero.module.scss";
import ContentSection from "@/components/UI/ContentSection/ContentSection";

export type BigHeroProps = {
  title?: string;
  subtitle1?: string;
  subtitle2?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function BigHero({ title, subtitle1, subtitle2, children, className }: BigHeroProps) {
  return (
    <ContentSection className={`${styles.root} ${className ?? ""}`} ariaLabel={title ?? "Hero"}>
        <div className={styles.content}>
            {title && <h1 className={`title-large ${styles.title}`}>{title}</h1>}
            {subtitle1 && <p className={`body-large ${styles.subtitle1}`}>{subtitle1}</p>}
            {subtitle2 && <p className={`body-large ${styles.subtitle2}`}>{subtitle2}</p>}
            {children}
        </div>
    </ContentSection>
  );
}
