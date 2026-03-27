import ContentCard from "@/components/ContentCard/ContentCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import styles from "./ExperienceTimelineCard.module.scss";

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  location?: string;
  description?: string;
};

export type ExperienceTimelineCardProps = {
  title: string;
  link?: string;
  experiences?: ExperienceItem[];
  className?: string;
};

const ExperienceTimelineCard = ({
  title,
  link,
  experiences = [],
  className,
}: ExperienceTimelineCardProps) => {
  const showLink = Boolean(link?.trim());
  const sectionLabel = title.trim() || "Work experience";

  return (
    <ContentCard>
      <div className={clsx(styles.root, className)}>
        <div className={styles.topRow}>
          <header className={styles.header}>
            <h2 className={`${styles.title} title-medium`}>{title}</h2>
          </header>
          {showLink && (
            <Link href={link!.trim()} className={styles.actionButton} aria-label={`Open ${title}`}>
              <ArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>

        <section className={styles.timelineSection} aria-label={sectionLabel}>
          <ol className={styles.timelineList}>
            {experiences.map(
              ({ period, role, company, location, description }, index) => {
                const loc = location?.trim();
                const desc = description?.trim();

                return (
                  <li key={`${company}-${role}-${index}`} className={styles.timelineItem}>
                    <span className={styles.marker} aria-hidden="true" />
                    <div className={styles.itemBody}>
                      <p className={`overline-text ${styles.period}`}>{period}</p>
                      <h3 className={`body-large-strong ${styles.role}`}>{role}</h3>
                      <p className={`body-small ${styles.company}`}>{company}</p>
                      {loc ? <p className={`body-small ${styles.location}`}>{loc}</p> : null}
                      {desc ? (
                        <div
                          className={`body-small ${styles.description}`}
                          dangerouslySetInnerHTML={{ __html: desc }}
                        />
                      ) : null}
                    </div>
                  </li>
                );
              }
            )}
          </ol>
        </section>
      </div>
    </ContentCard>
  );
};

export default ExperienceTimelineCard;
