"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import ContentCard from "@/components/ContentCard/ContentCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import styles from "./ProfileIntroCard.module.scss";
import { getProfileIntroIcon } from "./profileIntroIcons";

export type ProfileIntroItem = {
  label: string;
  description?: string;
  icon: string;
};

export type ProfileIntroCardProps = {
  title: string;
  intro: string;
  skillItems?: ProfileIntroItem[];
  hobbyItems?: ProfileIntroItem[];
  link: string;
  image?: string;
  className?: string;
};

type TabId = "skills" | "hobbies";

const ProfileIntroCard = ({
  title,
  intro,
  skillItems = [],
  hobbyItems = [],
  link,
  image,
  className,
}: ProfileIntroCardProps) => {
  const baseId = useId();
  const [activeTab, setActiveTab] = useState<TabId>("skills");
  const skillsTabRef = useRef<HTMLButtonElement>(null);
  const hobbiesTabRef = useRef<HTMLButtonElement>(null);

  const skillsTabId = `${baseId}-tab-skills`;
  const hobbiesTabId = `${baseId}-tab-hobbies`;
  const skillsPanelId = `${baseId}-panel-skills`;
  const hobbiesPanelId = `${baseId}-panel-hobbies`;

  const showImage = Boolean(image?.trim());

  const focusTab = useCallback((tab: TabId) => {
    (tab === "skills" ? skillsTabRef : hobbiesTabRef).current?.focus();
  }, []);

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, current: TabId) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const next: TabId = current === "skills" ? "hobbies" : "skills";
        setActiveTab(next);
        focusTab(next);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        setActiveTab("skills");
        skillsTabRef.current?.focus();
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        setActiveTab("hobbies");
        hobbiesTabRef.current?.focus();
      }
    },
    [focusTab]
  );

  const renderItemGrid = (items: ProfileIntroItem[], variant: "skills" | "hobbies") => {
    if (!items.length) {
      return null;
    }

    return (
      <ul
        className={clsx(styles.itemGrid, variant === "skills" && styles.itemGridSkills)}
        role="list"
      >
        {items.map(({ label, description, icon }, index) => {
          const Icon = getProfileIntroIcon(icon);
          const desc = description?.trim();

          return (
            <li key={`${label}-${index}`} className={styles.itemCard}>
              <span className={styles.itemIconWrap} aria-hidden="true">
                <Icon className={styles.itemIconSvg} />
              </span>
              <div className={styles.itemText}>
                <span className={`body-large-strong ${styles.itemLabel}`}>{label}</span>
                {desc ? (
                  <div
                    className={`body-small ${styles.itemDescription}`}
                    dangerouslySetInnerHTML={{ __html: desc }}
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ContentCard>
      <div className={clsx(styles.root, className)}>
        <div className={styles.topRow}>
          <header className={styles.header}>
            <h2 className={`${styles.title} title-medium`}>{title}</h2>
          </header>
          <Link href={link} className={styles.actionButton} aria-label={`Open ${title}`}>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className={clsx(styles.introBlock, showImage && styles.introBlockWithImage)}>
          {showImage && (
            <div className={styles.avatar} aria-hidden="true">
              <Image
                src={image!.trim()}
                alt=""
                fill
                className={styles.avatarImage}
                sizes="(max-width: 768px) 96px, 112px"
              />
            </div>
          )}
          <div
            className={`body-small ${styles.intro}`}
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        </div>

        <div className={styles.tabSection}>
          <div
            className={styles.tabList}
            role="tablist"
            aria-label="Skills and hobbies"
          >
            <button
              ref={skillsTabRef}
              type="button"
              id={skillsTabId}
              role="tab"
              aria-selected={activeTab === "skills"}
              aria-controls={skillsPanelId}
              tabIndex={activeTab === "skills" ? 0 : -1}
              className={clsx(styles.tab, activeTab === "skills" && styles.tabActive)}
              onClick={() => setActiveTab("skills")}
              onKeyDown={(e) => handleTabKeyDown(e, "skills")}
            >
              Skills
            </button>
            <button
              ref={hobbiesTabRef}
              type="button"
              id={hobbiesTabId}
              role="tab"
              aria-selected={activeTab === "hobbies"}
              aria-controls={hobbiesPanelId}
              tabIndex={activeTab === "hobbies" ? 0 : -1}
              className={clsx(styles.tab, activeTab === "hobbies" && styles.tabActive)}
              onClick={() => setActiveTab("hobbies")}
              onKeyDown={(e) => handleTabKeyDown(e, "hobbies")}
            >
              Hobbies
            </button>
          </div>

          <div
            id={skillsPanelId}
            role="tabpanel"
            aria-labelledby={skillsTabId}
            hidden={activeTab !== "skills"}
            className={styles.tabPanel}
          >
            {renderItemGrid(skillItems, "skills")}
          </div>
          <div
            id={hobbiesPanelId}
            role="tabpanel"
            aria-labelledby={hobbiesTabId}
            hidden={activeTab !== "hobbies"}
            className={styles.tabPanel}
          >
            {renderItemGrid(hobbyItems, "hobbies")}
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

export default ProfileIntroCard;
