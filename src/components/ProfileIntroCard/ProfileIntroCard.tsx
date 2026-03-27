"use client";

import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ContentCard from "@/components/ContentCard/ContentCard";
import Image from "next/image";
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

const PANEL_DURATION = 0.22;

const listContainerStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const listContainerStatic = {
  show: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
};

const itemVariantsStagger = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const itemVariantsStatic = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

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
  const [listStaggerEnabled, setListStaggerEnabled] = useState(false);
  const skillsTabRef = useRef<HTMLButtonElement>(null);
  const hobbiesTabRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const skillsTabId = `${baseId}-tab-skills`;
  const hobbiesTabId = `${baseId}-tab-hobbies`;
  const skillsPanelId = `${baseId}-panel-skills`;
  const hobbiesPanelId = `${baseId}-panel-hobbies`;

  const showImage = Boolean(image?.trim());
  const staggerList = listStaggerEnabled && !reduceMotion;

  const selectTab = useCallback((tab: TabId) => {
    setActiveTab((prev) => {
      if (prev !== tab) {
        setListStaggerEnabled(true);
      }
      return tab;
    });
  }, []);

  const focusTab = useCallback((tab: TabId) => {
    (tab === "skills" ? skillsTabRef : hobbiesTabRef).current?.focus();
  }, []);

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, current: TabId) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const next: TabId = current === "skills" ? "hobbies" : "skills";
        selectTab(next);
        focusTab(next);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        selectTab("skills");
        skillsTabRef.current?.focus();
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        selectTab("hobbies");
        hobbiesTabRef.current?.focus();
      }
    },
    [focusTab, selectTab]
  );

  const renderItemGrid = (items: ProfileIntroItem[], variant: "skills" | "hobbies", stagger: boolean) => {
    if (!items.length) {
      return null;
    }

    const containerVariants = stagger ? listContainerStagger : listContainerStatic;
    const itemVariants = stagger ? itemVariantsStagger : itemVariantsStatic;

    return (
      <motion.ul
        className={clsx(styles.itemGrid, variant === "skills" && styles.itemGridSkills)}
        role="list"
        variants={containerVariants}
        initial={stagger ? "hidden" : false}
        animate="show"
      >
        {items.map(({ label, description, icon }, index) => {
          const Icon = getProfileIntroIcon(icon);
          const desc = description?.trim();

          return (
            <motion.li key={`${label}-${index}`} className={styles.itemCard} variants={itemVariants}>
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
            </motion.li>
          );
        })}
      </motion.ul>
    );
  };

  const panelTransition = reduceMotion ? { duration: 0 } : { duration: PANEL_DURATION, ease: "easeInOut" as const };

  return (
    <ContentCard>
      <div className={clsx(styles.root, className)}>
        <header className={styles.cardHeader}>
          <div className={styles.topRow}>
            <h2 className={`${styles.title} title-medium`}>{title}</h2>
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
        </header>

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
              onClick={() => selectTab("skills")}
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
              onClick={() => selectTab("hobbies")}
              onKeyDown={(e) => handleTabKeyDown(e, "hobbies")}
            >
              Hobbies
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              id={activeTab === "skills" ? skillsPanelId : hobbiesPanelId}
              role="tabpanel"
              aria-labelledby={activeTab === "skills" ? skillsTabId : hobbiesTabId}
              className={styles.tabPanel}
              initial={reduceMotion || !listStaggerEnabled ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={panelTransition}
            >
              {activeTab === "skills"
                ? renderItemGrid(skillItems, "skills", staggerList)
                : renderItemGrid(hobbyItems, "hobbies", staggerList)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ContentCard>
  );
};

export default ProfileIntroCard;
