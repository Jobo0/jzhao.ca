import ContentCard from "@/components/ContentCard/ContentCard";
import Link from "next/link";
import Image from "next/image";
import styles from "./BigThumbnailCard.module.scss";

interface BigThumbnailCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
}

const BigThumbnailCard = ({
  title,
  description,
  link,
  image,
}: BigThumbnailCardProps) => {
  return (
    <ContentCard>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={`${styles.title} title-medium`}>{title}</h2>
          <p className={`body-small ${styles.description}`}>{description}</p>
        </header>
        <Link href={link} className={styles.thumbnailLink} aria-label={`Open ${title}`}>
          <Image
            src={image}
            alt=""
            fill
            className={styles.thumbnailImage}
            sizes="(max-width: 768px) 120px, 160px"
            priority={false}
          />
        </Link>
      </div>
    </ContentCard>
  );
};

export default BigThumbnailCard;