import clsx from "clsx";
import styles from "./Button.module.scss";

type ButtonVariant = "default" | "primary" | "ghost" | "link";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = React.PropsWithChildren<{
  as?: "button" | "a";
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}> & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  as = "button",
  href,
  variant = "default",
  size = "medium",
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const roleClass =
    variant === "primary"
      ? styles.primary
      : variant === "ghost"
      ? styles.ghost
      : variant === "link"
      ? styles.linkStyle
      : undefined;
  const sizeClass = styles[size];
  const classes = clsx(styles.button, roleClass, sizeClass, {
    [styles.fullWidth]: fullWidth,
  }, className);

  if (as === "a") {
    return (
      <a
        href={href}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}


