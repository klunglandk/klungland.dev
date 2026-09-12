import type { CSSProperties } from "react";
import styles from "./Modal.module.css";

interface ModalImageProps {
  src: string;
  alt: string;
  maxHeight?: string;
}

export default function ModalImage({ src, alt, maxHeight }: ModalImageProps) {
  return (
    <img
      className={styles["modal-image"]}
      style={maxHeight ? ({ maxHeight } as CSSProperties) : undefined}
      src={src}
      alt={alt}
      onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
    />
  );
}
