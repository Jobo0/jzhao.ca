import ContentCard from "@/components/ContentCard/ContentCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import styles from "./BigProjectsCard.module.scss";

export type BigProjectsCardProject = {
  title: string;
  description: string;
  thumbnail: string;
  href: string;
};

export type BigProjectsCardProps = {
  title: string;
  description: string;
  link: string;
  projects?: BigProjectsCardProject[];
  className?: string;
};

const isExternalHref = (href: string) => href.toLowerCase().startsWith("http");

const BigProjectsCard = ({
  title,
  description,
  link,
  projects = [],
  className,
}: BigProjectsCardProps) => {
  return (
    <ContentCard>
      <div className={clsx(styles.root, className)}>
        <div className={styles.topRow}>
          <header className={styles.header}>
            <h2 className={`${styles.title} title-medium`}>{title}</h2>
            <div
              className={`body-small ${styles.description}`}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </header>
          <Link href={link} className={styles.actionButton} aria-label={`Open ${title}`}>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.projectsGrid} role="list" aria-label="Projects">
          {projects.map(({ title: projectTitle, description: projectDescription, thumbnail, href }, index) => {
            const external = isExternalHref(href);

            return (
              <Link
                key={`${projectTitle}-${index}`}
                href={href}
                className={styles.projectCard}
                role="listitem"
                aria-label={`Open ${projectTitle}`}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
              >
                <span className={styles.thumbnail} aria-hidden="true">
                  <Image src={thumbnail} alt="" fill className={styles.thumbnailImage} sizes="(max-width: 768px) 56px, 56px" />
                </span>
                <span className={styles.projectText}>
                  <span className={`body-large-strong ${styles.projectTitle}`}>{projectTitle}</span>
                  <span
                    className={`body-small ${styles.projectDescription}`}
                    dangerouslySetInnerHTML={{ __html: projectDescription }}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ContentCard>
  );
};

export default BigProjectsCard;

