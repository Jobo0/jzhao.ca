import clsx from "clsx";
import styles from "./Overline.module.scss";

type Props = React.PropsWithChildren<{
  as?: React.ElementType;
  align?: "left" | "center" | "right";
  muted?: boolean;
  className?: string;
}>;

export function Overline({ as: Tag = "div", align = "left", muted = false, className, children }: Props) {
  return (
    <Tag
      className={clsx(
        styles.root,
        "overline-text",
        styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`],
        { [styles.muted]: muted },
        className
      )}
    >
      {children}
    </Tag>
  );
}


