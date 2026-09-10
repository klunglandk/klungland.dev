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
}: Button) {
  const buttonClass = `${styles.btn} ${type ? styles[type] : ""} ${active ? styles.active : ""}`;

  const content = (
    <>
      {iconImage ? (
        <div
          className={`${styles["btn-icon"]} ${styles["btn-icon-brand"]}`}
        >
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
    return (
      <Link to={href} onClick={onClick} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      {content}
    </button>
  );
}
