import React from "react";
import styles from "./Hero.module.scss";

export type HeroProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function Hero({ title, subtitle, children, className }: HeroProps) {
  return (
    <section className={`${styles.root} ${className ?? ""}`} role="region">
      {title && <h1 className={`title-large ${styles.title}`}>{title}</h1>}
      {subtitle && <p className={`body-large ${styles.subtitle}`}>{subtitle}</p>}
      {children}
    </section>
  );
}


