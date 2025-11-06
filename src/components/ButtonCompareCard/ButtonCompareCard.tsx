import ButtonCompareContainer, { CompareContent } from "./ButtonCompareContainer/ButtonCompareContainer";
import ContentCard from "@/components/ContentCard/ContentCard";
import styles from "./ButtonCompareCard.module.scss";

interface ButtonCompareCardProps {
  title: string;
  items: CompareContent[];
}

const ButtonCompareCard = ({
  title,
  items,
}: ButtonCompareCardProps) => {
  return (
    <ContentCard>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={`${styles.title} title-medium`}>{title}</h2>
        </header>
        <ButtonCompareContainer items={items} />
      </div>
    </ContentCard>
  );
};

export default ButtonCompareCard;