import type { Row } from "../../types/common";
import styles from "./Row.module.css";

export default function Row({ children }: Row) {
  return <div className={styles.row}>{children}</div>;
}
