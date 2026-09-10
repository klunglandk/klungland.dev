import type { CSSProperties } from "react";
import type { Timeline, TimelineEntry } from "../../types/common";
import styles from "./Timeline.module.css";

const ACCENT_COLORS = [
  "var(--primary)",
  "var(--info)",
  "var(--secondary)",
  "var(--accent)",
];

export default function Timeline({ items, type }: Timeline) {
  const groups = new Map<string, TimelineEntry[]>();
  for (const item of items) {
    const group = groups.get(item.label) ?? [];
    group.push(item);
    groups.set(item.label, group);
  }
  const groupedItems = [...groups.values()].flat();

  const labelColors = new Map<string, string>();
  for (const label of groups.keys()) {
    labelColors.set(
      label,
      ACCENT_COLORS[labelColors.size % ACCENT_COLORS.length],
    );
  }

  return (
    <div className={`${styles.timeline} ${styles[type]}`}>
      {groupedItems.map((item, i) => {
        const isNewLabel = item.label !== groupedItems[i - 1]?.label;
        const style = {
          "--accent-color": labelColors.get(item.label),
        } as CSSProperties;

        return (
          <div className={styles["timeline-item"]} style={style} key={i}>
            {isNewLabel && <div className={styles.label}>{item.label}</div>}
            <span className={styles.bullet} />
            <div className={styles.title}>{item.title}</div>
            {i < groupedItems.length - 1 && <span className={styles.line} />}
            <div className={styles.description}>
              {item.description}
              {item.footer && (
                <div className={styles.footer}>{item.footer}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
