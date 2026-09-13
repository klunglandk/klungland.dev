import { useState } from "react";
import { Link } from "react-router-dom";
import type { Card, Image } from "../../types/common";
import { useImages } from "../../hooks/useImages";
import { linkify } from "../../utils/linkify";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import Modal from "../Modal/Modal";
import ModalImage from "../Modal/ModalImage";
import TagList from "../TagList/TagList";
import styles from "./Card.module.css";

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
  actionLabel,
}: Card) {
  const isGallery = type === "gallery";
  const { images, loading, error } = useImages(
    isGallery ? (collectionName ?? "") : "",
    maxImages,
  );
  const cardClass = `${styles.card} ${type ? styles[type] : ""}`;
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

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
          <Modal onClose={() => setSelectedImage(null)}>
            <ModalImage src={selectedImage.src} alt={selectedImage.alt} />
            {selectedImage.description && (
              <p className={styles["image-modal-description"]}>
                {linkify(selectedImage.description)}
              </p>
            )}
          </Modal>
        )}
      </>
    );
  }

  const content = (
    <>
      {(type === "image" || image) && (
        <div className={styles["card-img"]}>
          <img
            src={image}
            onLoad={(e) => e.currentTarget.classList.add(styles.loaded)}
          />
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
        {footer && (
          <div className={styles["card-footer"]}>
            {Array.isArray(footer) ? <TagList tags={footer} /> : footer}
          </div>
        )}
        {actionLabel && (
          <Button variant="primary" label={actionLabel} onClick={onClick} />
        )}
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

  if (onClick) {
    return (
      <div
        className={`${cardClass} ${styles.clickable}`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {content}
      </div>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
