import ContentCard from "@/components/ContentCard/ContentCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./BigLinkCard.module.scss";

interface BigLinkCardProps {
  title: string;
  description: string;
  link: string;
}

const BigLinkCard = ({
  title,
  description,
  link,
}: BigLinkCardProps) => {
  return (
    <ContentCard>
      <div className={styles.container}>
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
      <div className={styles.content}></div>
    </ContentCard>
  );
};

export default BigLinkCard;