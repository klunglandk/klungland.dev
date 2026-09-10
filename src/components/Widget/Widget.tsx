import { useEffect, useRef, useState } from "react";
import styles from "./Widget.module.css";
import type { Widget } from "../../types/common";

export default function Widget({ title, children, type }: Widget) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Only ever grow the min-height, so the widget doesn't shrink when its content changes (e.g. switching tabs)
    const observer = new ResizeObserver(([entry]) => {
      setMinHeight((prev) => Math.max(prev, entry.contentRect.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.widget} ${type ? styles[type] : ""}`}>
      {title && (
        <div className={styles["widget-header"]}>
          {type === "small" ? (
            <h3 className={styles["widget-title"]}>{title}</h3>
          ) : (
            <h2 className={styles["widget-title"]}>{title}</h2>
          )}
        </div>
      )}
      <div
        className={styles["widget-content"]}
        ref={contentRef}
        style={{ minHeight }}
      >
        {children}
      </div>
    </div>
  );
}
