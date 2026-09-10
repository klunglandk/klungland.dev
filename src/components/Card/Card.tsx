import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Card, Image } from "../../types/common";
import { useImages } from "../../hooks/useImages";
import { linkify } from "../../utils/linkify";
import Icon from "../Icon/Icon";
import styles from "./Card.module.css";

const CLOSE_ANIMATION_MS = 200;

export default function Card({
  title,
  type,
  onClick,
  image,
  icon,
  children,
  footer,
  href,
  collectionName,
  maxImages,
}: Card) {
  const isGallery = type === "gallery";
  const { images, loading, error } = useImages(
    isGallery ? (collectionName ?? "") : "",
    maxImages,
  );
  const cardClass = `${styles.card} ${type ? styles[type] : ""}`;
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, CLOSE_ANIMATION_MS);
  };

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  useEffect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedImage]);

  if (isGallery) {
    if (loading) {
      return <div className={cardClass}>Loading images...</div>;
    }

    if (error) {
      return <div className={cardClass}>{error}</div>;
    }

    if (images.length === 0) {
      return <div className={cardClass}>No images found</div>;
    }

    return (
      <>
        {images.map((img) => (
          <div
            className={cardClass}
            key={img.src}
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.src}
              alt={img.alt}
              onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
            />
          </div>
        ))}
        {selectedImage && (
          <div
            className={`${styles["image-modal-overlay"]} ${isClosing ? styles.closing : ""}`}
            onClick={closeModal}
          >
            <div
              className={`${styles["image-modal"]} ${isClosing ? styles.closing : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles["image-modal-close"]}
                onClick={closeModal}
                aria-label="Lukk"
              >
                ×
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
              />
              {selectedImage.description && (
                <p className={styles["image-modal-description"]}>
                  {linkify(selectedImage.description)}
                </p>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  const content = (
    <>
      {type === "image" && (
        <div className={styles["card-img"]}>
          <img src={image} />
        </div>
      )}
      <div className={styles["card-content"]}>
        {icon && (
          <div className={styles["card-icon"]}>
            <Icon icon={icon} size={28} />
          </div>
        )}
        {title && <h4>{title}</h4>}
        {children && (
          <div className={styles["card-description"]}>{children}</div>
        )}
        {footer && <div className={styles["card-footer"]}>{footer}</div>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link to={href} onClick={onClick} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
