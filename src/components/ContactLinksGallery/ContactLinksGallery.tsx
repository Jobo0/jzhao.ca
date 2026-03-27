"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";
import clsx from "clsx";
import Link from "next/link";
import { FileUser, Github, Linkedin, Mail } from "lucide-react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import ContentSection from "@/components/UI/ContentSection/ContentSection";
import styles from "./ContactLinksGallery.module.scss";

const PARALLAX_PX = 5;
const springOpts = { stiffness: 84, damping: 28, mass: 0.55 };


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
    icon: <FileUser aria-hidden="true" />,
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
    return <FileUser aria-hidden="true" />;
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
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const springX = useSpring(0, springOpts);
  const springY = useSpring(0, springOpts);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    springX.set(nx * 2 * PARALLAX_PX);
    springY.set(ny * 2 * PARALLAX_PX);
  };

  const onPointerLeave = () => {
    springX.set(0);
    springY.set(0);
  };

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

  const body =
    reducedMotion ? (
      inner
    ) : (
      <motion.div
        ref={wrapRef}
        className={styles.parallaxWrap}
        style={{ x: springX, y: springY }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {inner}
      </motion.div>
    );

  if (contentOnly) {
    return <div className={clsx(styles.root, className)}>{body}</div>;
  }

  return (
    <ContentSection className={clsx(styles.root, className)} ariaLabel="Contact links gallery">
      {body}
    </ContentSection>
  );
};

const PlaceholderIcon = () => <span className={styles.placeholderSymbol}>?</span>;

export default ContactLinksGallery;

