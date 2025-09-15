import React from "react";
import styles from "./WindowHeroSection.module.scss";
import WindowSection from "@/components/UI/WindowSection/WindowSection";
import { Heading, Text } from "@/components/atoms";

export type WindowHeroSectionProps = {
  title?: string;
  description?: string;
  className?: string;
  /** Pass through props to WindowSection when needed */
  windowProps?: Partial<React.ComponentProps<typeof WindowSection>>;
};

export default function WindowHeroSection({
  title,
  description,
  className,
  windowProps,
}: WindowHeroSectionProps) {
  return (
    <section className={`${styles.root} ${className ?? ""}`} role="region">
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
            <Heading level={1} className={styles.title}>
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
    </section>
  );
}


