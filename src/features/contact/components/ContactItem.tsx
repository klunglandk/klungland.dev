import type { ReactNode } from "react";
import Icon from "../../../components/Icon/Icon";
import type { IconName } from "../../../types/icon";
import styles from "./ContactItem.module.css";

interface ContactItemProps {
  icon?: IconName;
  iconImage?: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  action?: ReactNode;
}

export default function ContactItem({
  icon,
  iconImage,
  label,
  value,
  href,
  external,
  action,
}: ContactItemProps) {
  const content = (
    <>
      <div className={styles["contact-item-icon"]}>
        {iconImage ? (
          <img src={iconImage} alt="" width={20} height={20} />
        ) : (
          icon && <Icon icon={icon} size={22} />
        )}
      </div>
      <div className={styles["contact-item-text"]}>
        <span className={styles["contact-item-label"]}>{label}</span>
        <span className={styles["contact-item-value"]}>{value}</span>
      </div>
      <div className={styles["contact-item-action"]}>
        {action ?? (
          <div className={styles["contact-item-link"]}>
            <Icon icon="externalLink" size={20} />
          </div>
        )}
      </div>
    </>
  );

  if (!href) {
    return (
      <div className={`${styles["contact-item"]} ${styles.disabled}`}>
        {content}
      </div>
    );
  }

  return (
    <a
      className={styles["contact-item"]}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}
