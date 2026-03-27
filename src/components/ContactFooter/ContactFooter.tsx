import { type ReactNode } from "react";
import clsx from "clsx";
import styles from "./ContactFooter.module.scss";
import ContentSection from "@/components/UI/ContentSection/ContentSection";
import { Button } from "@/components/atoms";
import ContactLinksGallery, {
  type ContactLinksGalleryItem,
} from "@/components/ContactLinksGallery/ContactLinksGallery";

export type ContactFooterProps = {
  title?: string;
  subtitle?: string;
  items?: ContactLinksGalleryItem[];
  /** When true, shows a secondary link (e.g. on the home page). Off by default for the /contact page. */
  showContactButton?: boolean;
  buttonLabel?: string;
  contactButtonHref?: string;
  children?: ReactNode;
  className?: string;
};

const ContactFooter = ({
  title,
  subtitle,
  items,
  showContactButton = false,
  buttonLabel = "Contact me",
  contactButtonHref = "/contact",
  children,
  className,
}: ContactFooterProps) => {
  const galleryItems = items?.length ? items : undefined;

  return (
    <ContentSection
      className={clsx(styles.root, className)}
      ariaLabel={title ?? "Contact"}
    >
      <div className={styles.layout}>
        <div className={styles.headerRow}>
          <div className={styles.copyGroup}>
            {title && <h2 className={`title-medium ${styles.title}`}>{title}</h2>}
            {subtitle && <p className={`body-small ${styles.subtitle}`}>{subtitle}</p>}
          </div>
          {showContactButton && (
            <div className={styles.actionGroup}>
              <Button as="a" href={contactButtonHref} variant="ghost" size="small">
                {buttonLabel}
              </Button>
            </div>
          )}
        </div>
        <ContactLinksGallery items={galleryItems} contentOnly className={styles.gallerySlot} />
        {children ? <div className={styles.extraGroup}>{children}</div> : null}
      </div>
    </ContentSection>
  );
};

export default ContactFooter;
