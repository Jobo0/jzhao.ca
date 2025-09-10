import clsx from "clsx";
import styles from "./Divider.module.scss";

type Props = {
  spaced?: boolean;
  className?: string;
};

export function Divider({ spaced = false, className }: Props) {
  return <hr className={clsx(styles.root, { [styles.spaced]: spaced }, className)} />;
}


