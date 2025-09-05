import React from "react";
import { Cone, Wrench, Sparkles } from "lucide-react";
import styles from "./MaintenanceBlurb.module.scss";

export type MaintenanceBlurbProps = {
  overline?: string;
  title?: string;
  message?: string;
};

export default function MaintenanceBlurb({
  overline = "Notice",
  title = "This page is under maintenance",
  message = "We’re actively working on this section. Content and features may change while we iterate. Please check back soon.",
}: MaintenanceBlurbProps) {
  return (
    <section className={styles.root} role="status" aria-live="polite">
      <div className={styles.wrapper}>
        <div className={styles.badgeRow}>
          <Cone className={styles.badgeIcon} aria-hidden />
          <span className={`overline-text ${styles.badgeText}`}>{overline}</span>
        </div>
        <h1 className={`title-medium ${styles.title}`}>
          {title}
          <Sparkles className={styles.sparkle} aria-hidden />
        </h1>
        <p className={`body-large ${styles.subtitle}`}>{message}</p>

        <div className={styles.tools}>
          <div className={styles.tool}>
            <Wrench aria-hidden />
            <span className="body-small">Tightening UI bolts…</span>
          </div>
          <div className={styles.tool}>
            <Wrench aria-hidden />
            <span className="body-small">Polishing pixels…</span>
          </div>
          <div className={styles.tool}>
            <Wrench aria-hidden />
            <span className="body-small">Pracicing LeetCode…</span>
          </div>
        </div>
      </div>
      <div className={styles.scaffold} aria-hidden>
        <div className={styles.scaffoldBeam} />
        <div className={styles.scaffoldBeam} />
        <div className={styles.scaffoldBeam} />
      </div>
    </section>
  );
}


