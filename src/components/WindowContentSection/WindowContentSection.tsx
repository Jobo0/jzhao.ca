import React from "react";
import styles from "./WindowContentSection.module.scss";
import WindowSection from "@/components/UI/WindowSection/WindowSection";
import { Heading, Text } from "@/components/atoms";

export type SidePlacement = "left" | "right";

export type WindowContentSectionProps = {
  /** Title shown inside the window */
  title?: string;
  /** Description shown under the title inside the window */
  description?: string;
  /** Optional className for root */
  className?: string;
  /** Element to render next to the window (e.g., image, illustration, list) */
  side?: React.ReactNode;
  /** Whether the side element appears on the left or right */
  sidePlacement?: SidePlacement;
  /** Pass-through props for WindowSection to customize its frame */
  windowProps?: Partial<React.ComponentProps<typeof WindowSection>>;
};

const WindowContentSection: React.FC<WindowContentSectionProps> = ({
  title,
  description,
  className,
  side,
  sidePlacement = "right",
  windowProps,
}) => {
  return (
    <section
      className={`${styles.root} ${className ?? ""}`}
      role="region"
      aria-label={title}
    >
      <div
        className={
          sidePlacement === "left" ? styles.layoutLeft : styles.layoutRight
        }
      >
        {side ? <div className={styles.side}>{side}</div> : null}
        <div className={styles.windowCol}>
          <WindowSection
            useContainer={true}
            padding="lg"
            bordered={false}
            surface="tinted"
            align="start"
            direction="column"
            ariaLabel={title}
            {...windowProps}
          >
            <div className={styles.content}>
              {title ? (
                <Heading level={2} className={styles.title}>
                  {title}
                </Heading>
              ) : null}
              {description ? (
                <Text size="large" className={styles.description}>
                  {description}
                </Text>
              ) : null}
            </div>
          </WindowSection>
        </div>
      </div>
    </section>
  );
};

export default WindowContentSection;


