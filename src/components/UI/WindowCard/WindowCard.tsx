import { type ReactNode } from "react";
import clsx from "clsx";
import styles from "./WindowCard.module.scss";

export type WindowCardProps = {
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

const WindowCard = ({ children, className, ariaLabel }: WindowCardProps) => {
  return (
    <div className={clsx(styles.root, className)} aria-label={ariaLabel} role="group">
      {children}
    </div>
  );
};

export default WindowCard;


