import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Icon from "../Icon/Icon";
import type { IconName } from "../../types/icon";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconImage?: string;
  iconSize?: number;
  label?: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    icon,
    iconImage,
    iconSize,
    label,
    onClick,
    href,
    active,
    className,
    children,
    ...rest
  },
  ref,
) {
  const buttonClass = clsx(
    styles.btn,
    variant && styles[variant],
    size && styles[size],
    active && styles.active,
    className,
  );

  const content = (
    <>
      {iconImage ? (
        <span className={clsx(styles["btn-icon"], styles["btn-icon-brand"])}>
          <img src={iconImage} alt="" width={iconSize} height={iconSize} />
        </span>
      ) : (
        icon && (
          <span className={styles["btn-icon"]}>
            <Icon icon={icon} size={iconSize} />
          </span>
        )
      )}
      {label && <span className={styles["btn-text"]}>{label}</span>}
      {children}
    </>
  );

  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          onClick={onClick}
          className={buttonClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return (
      <Link to={href} onClick={onClick} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} onClick={onClick} className={buttonClass} {...rest}>
      {content}
    </button>
  );
});

export default Button;
