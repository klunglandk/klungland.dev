import type { ButtonGroup } from "../../types/common";
import styles from "./Button.module.css";

export default function ButtonGroup({ type, children }: ButtonGroup) {
  return (
    <div className={`${styles["btn-group"]} ${styles[type]}`}>{children}</div>
  );
}
