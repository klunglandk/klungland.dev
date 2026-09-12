import Icon from "../Icon/Icon";
import type { Button } from "../../types/common";
import styles from "./Button.module.css";
import type { IconName } from "../../types/icon";
import { Link } from "react-router-dom";

export default function Button({
  icon,
  iconImage,
  iconSize,
  label,
  onClick,
  type,
  href,
  active,
  className,
  ...restProps
}: Button) {
  const buttonClass = `${styles.btn} ${type ? styles[type] : ""} ${active ? styles.active : ""} ${className ?? ""}`;

  const content = (
    <>
      {iconImage ? (
        <div className={`${styles["btn-icon"]} ${styles["btn-icon-brand"]}`}>
          <img src={iconImage} alt="" width={iconSize} height={iconSize} />
        </div>
      ) : (
        icon && (
          <div className={styles["btn-icon"]}>
            <Icon icon={icon as IconName} size={iconSize} />
          </div>
        )
      )}
      {label && <span className={styles["btn-text"]}>{label}</span>}
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
    <button onClick={onClick} className={buttonClass} {...restProps}>
      {content}
    </button>
  );
}
