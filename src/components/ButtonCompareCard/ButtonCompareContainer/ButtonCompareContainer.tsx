import React, { useState } from "react";
import styles from "./ButtonCompareContainer.module.scss";

export interface CompareContent {
  title: string;
  description: string;
  html: string;
}

interface ButtonCompareContainerProps {
  items: CompareContent[];
}

const ButtonCompareContainer = ({
  items = [
    {
      title: "Tenant 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      html: "<div><strong>Content 1</strong></div>",
    },
    {
      title: "Tenant 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      html: "<div><strong>Content 2</strong></div>",
    },
  ],
}: ButtonCompareContainerProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [navDirection, setNavDirection] = useState<"forward" | "backward">("forward");

  const handlePanelChange = (index: number) => {
    if (index === activeIndex) return;
    setPreviousIndex(activeIndex);
    setNavDirection(index > activeIndex ? "forward" : "backward");
    setActiveIndex(index);
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${styles.button} ${activeIndex === index ? styles.active : ""}`}
            onClick={() => handlePanelChange(index)}
          >
            <div className={styles.buttonContent}>
              <h2 className="body-large-strong">{item.title}</h2>
              <p className="body-small">{item.description}</p>
            </div>
          </button>
        ))}
      </header>
      <div className={styles.imageContainer}>
        <div className={styles.overlay}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isPrevious = index === previousIndex;
            const directionClass = isActive
              ? navDirection === "forward"
                ? styles.fromRight
                : styles.fromLeft
              : isPrevious
              ? navDirection === "forward"
                ? styles.fromLeft
                : styles.fromRight
              : "";
            return (
              <div
                key={index}
                className={`${styles.image} ${directionClass} ${isActive ? styles.active : ""}`}
                dangerouslySetInnerHTML={{ __html: item.html }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ButtonCompareContainer;
