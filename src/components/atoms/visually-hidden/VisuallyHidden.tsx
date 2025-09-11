import styles from "./VisuallyHidden.module.scss";

type Props = React.PropsWithChildren;

export function VisuallyHidden({ children }: Props) {
  return <span className={styles.root}>{children}</span>;
}


