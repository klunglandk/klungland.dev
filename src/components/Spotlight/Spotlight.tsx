import { useEffect, useMemo, useState } from "react";
import Card from "../Card/Card";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import ModalImage from "../Modal/ModalImage";
import TagList from "../TagList/TagList";
import { useProjectPreview } from "../../hooks/useProjectPreview";
import type { IconName } from "../../types/icon";
import styles from "./Spotlight.module.css";

export interface SpotlightEntry {
  key: string;
  category: string;
  slug: string;
  title: string;
  kind?: "document";
  sourceUrl?: string;
  demoUrl?: string;
}

interface SpotlightProps {
  entries: SpotlightEntry[];
  maxItems?: number;
  rotateIntervalMs?: number;
  browseHref?: string;
  browseLabel?: string;
  placeholderIcon?: IconName;
  placeholderTitle?: string;
  placeholderFooter?: string;
  emptyMessage?: string;
}

const DEFAULT_MAX_ITEMS = 5;
const DEFAULT_ROTATE_INTERVAL_MS = 100000;

export default function Spotlight({
  entries,
  maxItems = DEFAULT_MAX_ITEMS,
  rotateIntervalMs = DEFAULT_ROTATE_INTERVAL_MS,
  browseHref,
  browseLabel = "Browse everything",
  placeholderIcon = "image",
  placeholderTitle = "Title",
  placeholderFooter = "Coming soon",
  emptyMessage = "No items added yet",
}: SpotlightProps) {
  const items = useMemo(() => entries.slice(0, maxItems), [entries, maxItems]);
  const placeholderCount = Math.max(0, maxItems - items.length);

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    if (items.length <= 1 || modalIndex !== null) return;
    const id = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % items.length);
    }, rotateIntervalMs);
    return () => clearInterval(id);
  }, [items.length, modalIndex, rotateIntervalMs]);

  const spotlight = items[spotlightIndex] as SpotlightEntry | undefined;
  const modalEntry = modalIndex !== null ? items[modalIndex] : null;
  const modalImageSource = modalEntry ?? spotlight;

  const {
    image: spotlightImage,
    description: spotlightDescription,
    tags: spotlightTags,
  } = useProjectPreview(
    spotlight?.category ?? "",
    spotlight?.slug ?? "",
    spotlight?.kind,
  );
  const {
    image: modalImage,
    description: modalDescription,
    tags: modalTags,
    sourceUrl: modalSourceUrl,
  } = useProjectPreview(
    modalImageSource?.category ?? "",
    modalImageSource?.slug ?? "",
    modalImageSource?.kind,
  );

  if (!spotlight) {
    return <p>{emptyMessage}</p>;
  }

  const gridEntries = items.filter((_, i) => i !== spotlightIndex);
  const modalSource = modalEntry
    ? (modalSourceUrl ?? modalEntry.sourceUrl)
    : undefined;

  const openModal = (entry: SpotlightEntry) => {
    setModalIndex(items.findIndex((e) => e === entry));
  };

  const swapAndOpen = (entry: SpotlightEntry) => {
    const index = items.findIndex((e) => e === entry);
    setSpotlightIndex(index);
    setModalIndex(index);
  };

  return (
    <div className={styles.wrap}>
      <Card
        type="spotlight"
        image={spotlightImage?.src}
        title={spotlight.title}
        footer={spotlightTags}
        actionLabel="Check it out"
        onClick={() => openModal(spotlight)}
      >
        {spotlightDescription}
      </Card>

      {items.length > 1 && (
        <div className={styles.dots}>
          {items.map((entry, i) => (
            <span
              key={entry.key}
              className={`${styles.dot} ${i === spotlightIndex ? styles.active : ""}`}
            />
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {gridEntries.map((entry) => (
          <SpotlightGridCard
            key={entry.key}
            entry={entry}
            onSelect={swapAndOpen}
          />
        ))}
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <Card
            key={`placeholder-${i}`}
            type="item"
            icon={placeholderIcon}
            title={placeholderTitle}
            footer={placeholderFooter}
          />
        ))}
      </div>

      {browseHref && (
        <div className={styles.footer}>
          <Button variant="secondary" label={browseLabel} href={browseHref} />
        </div>
      )}

      {modalEntry && (
        <Modal onClose={() => setModalIndex(null)} variant="solid">
          {modalImage && (
            <ModalImage
              src={modalImage.src}
              alt={modalImage.alt}
              maxHeight="60vh"
            />
          )}
          <div className={styles["modal-content"]}>
            <h3>{modalEntry.title}</h3>
            <p>{modalDescription}</p>
            {modalTags && modalTags.length > 0 && <TagList tags={modalTags} />}
            <div className={styles.modalFooter}>
              <div className={styles.pager}>
                <Button
                  className={styles.previous}
                  icon="moveLeft"
                  iconSize={18}
                  onClick={() =>
                    setModalIndex((i) =>
                      i === null ? i : (i - 1 + items.length) % items.length,
                    )
                  }
                />
                <span>
                  {(modalIndex ?? 0) + 1} of {items.length}
                </span>
                <Button
                  className={styles.next}
                  icon="moveRight"
                  iconSize={18}
                  onClick={() =>
                    setModalIndex((i) =>
                      i === null ? i : (i + 1) % items.length,
                    )
                  }
                />
              </div>
              <div className={styles.links}>
                {modalSource && (
                  <Button
                    label={
                      modalEntry.kind === "document"
                        ? "Download PDF"
                        : "Source Code"
                    }
                    variant="primary"
                    href={modalSource}
                  />
                )}
                <Button
                  variant="secondary"
                  label={modalEntry.kind === "document" ? "Read more" : "Demo"}
                  href={
                    modalEntry.demoUrl ??
                    `/projects/${modalEntry.category}/${modalEntry.slug}`
                  }
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SpotlightGridCard({
  entry,
  onSelect,
}: {
  entry: SpotlightEntry;
  onSelect: (entry: SpotlightEntry) => void;
}) {
  const { image, description, tags } = useProjectPreview(
    entry.category,
    entry.slug,
    entry.kind,
  );

  return (
    <Card
      type="item"
      icon={image ? undefined : "image"}
      image={image?.src}
      title={entry.title}
      footer={tags}
      onClick={() => onSelect(entry)}
    >
      {description}
    </Card>
  );
}
