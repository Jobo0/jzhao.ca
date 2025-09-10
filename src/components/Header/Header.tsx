import Link from "next/link";
import styles from "./Header.module.scss";
import { Avatar } from "../atoms";

type HeaderProps = {
  title?: string;
  links?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
};

export default function Header({
  title = "jzhao.ca",
  links = [
    { label: "Home", href: "/" },
    { label: "Writing", href: "/writing" },
    { label: "Projects", href: "/projects" },
  ],
  ctaLabel = "About",
  ctaHref = "/about",
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <Avatar name={title} size="lg" />
          <span className={styles.title}>{title}</span>
        </Link>

        {links?.length ? (
          <nav className={styles.nav} aria-label="Primary">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        {ctaHref ? (
          <Link href={ctaHref} className={styles.cta}>
            <span>{ctaLabel}</span>
            <span className={styles.srOnly}>{title}</span>
          </Link>
        ) : null}
      </div>
    </header>
  );
}


