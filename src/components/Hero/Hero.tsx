import React from "react";
import styles from "./Hero.module.scss";
import ContentSection from "@/components/UI/ContentSection/ContentSection";
import WindowCard from "@/components/UI/WindowCard/WindowCard";

export type HeroProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Hero({ title, subtitle, children, className }: HeroProps) {
  return (
    <ContentSection className={`${styles.root} ${className ?? ""}`} ariaLabel={title ?? "Hero"}>
      <WindowCard>
        {title && <h1 className={`title-large ${styles.title}`}>{title}</h1>}
        {subtitle && <p className={`body-large ${styles.subtitle}`}>{subtitle}</p>}
        {children}
      </WindowCard>
    </ContentSection>
  );
}


