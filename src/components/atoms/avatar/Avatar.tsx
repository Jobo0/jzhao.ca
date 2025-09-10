import clsx from "clsx";
import styles from "./Avatar.module.scss";

type AvatarSize = "sm" | "md" | "lg";

type Props = {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
};

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase() || name[0]?.toUpperCase() || "?";
}

export function Avatar({ src, alt, name, size = "md", className }: Props) {
  return (
    <span className={clsx(styles.root, styles[size], className)} aria-label={alt || name}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || name || ""} className={styles.image} />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}


