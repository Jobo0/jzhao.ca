import ButtonCompareContainer, { CompareContent } from "./ButtonCompareContainer/ButtonCompareContainer";
import ContentCard from "@/components/ContentCard/ContentCard";
import styles from "./ButtonCompareCard.module.scss";

interface ButtonCompareCardProps {
  title: string;
  leftContent: CompareContent;
  rightContent: CompareContent;
}

const ButtonCompareCard = ({
  title,
  leftContent,
  rightContent,
}: ButtonCompareCardProps) => {
  return (
    <ContentCard>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={`${styles.title} title-medium`}>{title}</h2>
        </header>
        <ButtonCompareContainer leftContent={leftContent} rightContent={rightContent} />
      </div>
    </ContentCard>
  );
};

export default ButtonCompareCard;