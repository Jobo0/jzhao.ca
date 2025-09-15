import React from "react";
import styles from "./WindowLeftContentSection.module.scss";
import WindowContentSection from "@/components/WindowContentSection/WindowContentSection";

export type WindowLeftContentSectionProps = {
  title?: string;
  description?: string;
  className?: string;
};

const PlaceholderRight: React.FC = () => {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <div className={styles.placeholderCard} />
      <div className={styles.placeholderCard} />
      <div className={styles.placeholderCard} />
    </div>
  );
};

const WindowLeftContentSection: React.FC<WindowLeftContentSectionProps> = ({
  title = "Section Title",
  description = "A short description goes here to explain the content in this window.",
  className,
}) => {
  return (
    <WindowContentSection
      className={className}
      title={title}
      description={description}
      sidePlacement="right"
      side={<PlaceholderRight />}
      windowProps={{ padding: "lg", surface: "tinted", bordered: false }}
    />
  );
};

export default WindowLeftContentSection;


