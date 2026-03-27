import { type ReactNode } from "react";
import clsx from "clsx";
import Link from "next/link";
import { FileText, Github, Linkedin, Mail } from "lucide-react";
import ContentSection from "@/components/UI/ContentSection/ContentSection";
import styles from "./ContactLinksGallery.module.scss";


export type ContactLinksGalleryItem = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export type ContactLinksGalleryProps = {
  items?: ContactLinksGalleryItem[];
  /** When true, renders only the link grid (no wrapping ContentSection). Use inside another section. */
  contentOnly?: boolean;
  className?: string;
};

const DEFAULT_ITEMS: ContactLinksGalleryItem[] = [
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn profile",
    icon: <Linkedin aria-hidden="true" />,
  },
  {
    href: "https://github.com/",
    label: "GitHub profile",
    icon: <Github aria-hidden="true" />,
  },
  {
    href: "mailto:hello@example.com",
    label: "Send an email",
    icon: <Mail aria-hidden="true" />,
  },
  {
    href: "/resume.pdf",
    label: "Resume",
    icon: <FileText aria-hidden="true" />,
  },
];

const resolveIcon = ({ icon, href, label }: ContactLinksGalleryItem) => {
  if (icon) {
    return icon;
  }

  const normalizedHref = href.toLowerCase();
  const resumeInLabel = /\b(cv|resume)\b/i.test(label);

  const looksLikeResume =
    normalizedHref.includes("resume") ||
    normalizedHref.includes("/cv") ||
    resumeInLabel;

  if (looksLikeResume) {
    return <FileText aria-hidden="true" />;
  }

  if (normalizedHref.includes("linkedin")) {
    return <Linkedin aria-hidden="true" />;
  }

  if (normalizedHref.includes("github")) {
    return <Github aria-hidden="true" />;
  }

  if (normalizedHref.startsWith("mailto:")) {
    return <Mail aria-hidden="true" />;
  }

  return <PlaceholderIcon />;
};

const ContactLinksGallery = ({
  items = DEFAULT_ITEMS,
  contentOnly = false,
  className,
}: ContactLinksGalleryProps) => {
  const inner = (
    <div className={styles.gallery}>
      {items.map(({ href, label, icon }, index) => {
        const isExternal = href.startsWith("http");

        return (
          <Link
            key={`${label}-${index}`}
            href={href}
            className={styles.card}
            aria-label={label}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer noopener" : undefined}
          >
            <span className={styles.icon} aria-hidden="true">
              {resolveIcon({ href, label, icon })}
            </span>
            <span className={styles.srOnly}>{label}</span>
          </Link>
        );
      })}
    </div>
  );

  if (contentOnly) {
    return <div className={clsx(styles.root, className)}>{inner}</div>;
  }

  return (
    <ContentSection className={clsx(styles.root, className)} ariaLabel="Contact links gallery">
      {inner}
    </ContentSection>
  );
};

const PlaceholderIcon = () => <span className={styles.placeholderSymbol}>?</span>;

export default ContactLinksGallery;

