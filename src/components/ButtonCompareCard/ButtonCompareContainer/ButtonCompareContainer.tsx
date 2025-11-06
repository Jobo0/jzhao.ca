import React, { useState } from "react";
import styles from "./ButtonCompareContainer.module.scss";

export interface CompareContent {
  title: string;
  description: string;
  html: string;
}

interface ButtonCompareContainerProps {
  leftContent: CompareContent;
  rightContent: CompareContent;
}

const ButtonCompareContainer = ({
  leftContent = {
    title: "Tenant 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    html: "<div><strong>Traditional workflow</strong></div>",
  },
  rightContent = {
    title: "Tenant 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    html: "<div><strong>Autonomi workflow</strong></div>",
  },
}: ButtonCompareContainerProps) => {
  const [activePanel, setActivePanel] = useState<"left" | "right">("left");

  const handlePanelChange = (panel: "left" | "right") => {
    setActivePanel(panel);
  };
  return (
    <section className={styles.container}>
      <header
        className={`${styles.header} ${
          activePanel === "right" ? styles.secondActive : ""
        }`}
      >
        <button
          className={`${styles.button} ${
            activePanel === "left" ? styles.active : ""
          }`}
          onClick={() => handlePanelChange("left")}
        >
          <div className={styles.buttonContent}>
            <h2 className="body-large-strong">{leftContent.title}</h2>
            <p className="body-small">{leftContent.description}</p>
          </div>
        </button>
        <button
          className={`${styles.button} ${
            activePanel === "right" ? styles.active : ""
          }`}
          onClick={() => handlePanelChange("right")}
        >
          <div className={styles.buttonContent}>
            <h2 className="body-large-strong">{rightContent.title}</h2>
            <p className="body-small">{rightContent.description}</p>
          </div>
        </button>
      </header>
      <div className={styles.imageContainer}>
        <div className={styles.overlay}>
          <div
            className={`${styles.image} ${styles.fromLeft} ${
              activePanel === "left" ? styles.active : ""
            }`}
            dangerouslySetInnerHTML={{ __html: leftContent.html }}
          />
          <div
            className={`${styles.image} ${styles.fromRight} ${
              activePanel === "right" ? styles.active : ""
            }`}
            dangerouslySetInnerHTML={{ __html: rightContent.html }}
          />
        </div>
      </div>
    </section>
  );
};

export default ButtonCompareContainer;
