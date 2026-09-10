import type { Grid } from "../../types/common";
import styles from "./Grid.module.css";

export default function Grid({ children, type }: Grid) {
  return <div className={`${styles.grid} ${styles[type]}`}>{children}</div>;
}
