import NextLink from "next/link";
import clsx from "clsx";
import styles from "./Link.module.scss";

type AnchorProps = React.PropsWithChildren<{
  href: string;
  underline?: boolean;
  muted?: boolean;
  className?: string;
}> & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Anchor({ href, underline = false, muted = false, className, children, ...rest }: AnchorProps) {
  const classes = clsx(styles.link, { [styles.underline]: underline, [styles.muted]: muted }, className);
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <NextLink href={href} className={classes} {...rest}>
        {children}
      </NextLink>
    );
  }
  return (
    <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...rest}>
      {children}
    </a>
  );
}


