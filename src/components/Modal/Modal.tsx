import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Button from "../Button/Button";
import styles from "./Modal.module.css";

const CLOSE_ANIMATION_MS = 200;

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  variant?: "solid";
}

export default function Modal({ onClose, children, variant }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const close = () => {
    setIsClosing(true);
    setTimeout(onClose, CLOSE_ANIMATION_MS);
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className={`${styles["modal-overlay"]} ${isClosing ? styles.closing : ""}`}
      onClick={close}
    >
      <div
        className={`${styles.modal} ${variant ? styles[variant] : ""} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          className={styles["modal-close"]}
          icon="close"
          iconSize={24}
          onClick={close}
        />
        {children}
      </div>
    </div>
  );
}
