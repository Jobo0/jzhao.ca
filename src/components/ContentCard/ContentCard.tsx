import React from "react";
import styles from "./ContentCard.module.scss";
import ContentSection from "@/components/UI/ContentSection/ContentSection";
import WindowCard from "@/components/UI/WindowCard/WindowCard";

export type ContentCardProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function ContentCard({ children, className }: ContentCardProps) {
  return (
    <ContentSection className={`${styles.root} ${className ?? ""}`} ariaLabel={"Content"}>
      <WindowCard className={styles.card}>
        {children}
      </WindowCard>
    </ContentSection>
  );
}
