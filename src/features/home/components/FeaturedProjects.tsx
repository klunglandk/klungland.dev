import { useEffect, useMemo, useState } from "react";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import ModalImage from "../../../components/Modal/ModalImage";
import TagList from "../../../components/TagList/TagList";
import { GITHUB_REPO_URL } from "../../../config/social";
import { useProjectData } from "../../../hooks/useProjectData";
import {
  ProjectRegistry,
  PROJECT_CATEGORY_META,
  getCategoryCount,
  type ProjectEntry,
  type ProjectCategoryMeta,
} from "../../../config/projectRegistry";
import styles from "./FeaturedProjects.module.css";

const MAX_ITEMS = 5;
const ROTATE_INTERVAL_MS = 100000;

interface FeaturedEntry extends ProjectEntry {
  category: string;
  slug: string;
}

function getFeaturedEntries(): FeaturedEntry[] {
  return Object.entries(ProjectRegistry)
    .flatMap(([category, entries]) =>
      Object.entries(entries).map(([slug, entry]) => ({
        ...entry,
        category,
        slug,
      })),
    )
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, MAX_ITEMS);
}

export default function FeaturedProjects() {
  const realEntries = useMemo(() => getFeaturedEntries(), []);
  const placeholders = useMemo(
    () =>
      PROJECT_CATEGORY_META.filter((c) => getCategoryCount(c.key) === 0).slice(
        0,
        Math.max(0, MAX_ITEMS - realEntries.length),
      ),
    [realEntries.length],
  );

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
    if (realEntries.length <= 1 || modalIndex !== null) return;
    const id = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % realEntries.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [spotlightIndex, realEntries.length, modalIndex]);

  const spotlight = realEntries[spotlightIndex] as FeaturedEntry | undefined;
  const modalEntry = modalIndex !== null ? realEntries[modalIndex] : null;
  const modalImageSource = modalEntry ?? spotlight;

  const {
    image: spotlightImage,
    description: spotlightDescription,
    tags: spotlightTags,
  } = useProjectData(spotlight?.category ?? "", spotlight?.slug ?? "");
  const {
    image: modalImage,
    description: modalDescription,
    tags: modalTags,
  } = useProjectData(
    modalImageSource?.category ?? "",
    modalImageSource?.slug ?? "",
  );

  if (!spotlight) {
    return <p>No projects added yet</p>;
  }

  const gridSlots: (FeaturedEntry | ProjectCategoryMeta)[] = [
    ...realEntries.filter((_, i) => i !== spotlightIndex),
    ...placeholders,
  ];

  const openModal = (entry: FeaturedEntry) => {
    setModalIndex(realEntries.findIndex((e) => e === entry));
  };

  const swapAndOpen = (entry: FeaturedEntry) => {
    const index = realEntries.findIndex((e) => e === entry);
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

      {realEntries.length > 1 && (
        <div className={styles.dots}>
          {realEntries.map((entry, i) => (
            <span
              key={`${entry.category}:${entry.slug}`}
              className={`${styles.dot} ${i === spotlightIndex ? styles.active : ""}`}
            />
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {gridSlots.map((slot) =>
          "component" in slot ? (
            <FeaturedGridCard
              key={`${slot.category}:${slot.slug}`}
              entry={slot}
              onSelect={swapAndOpen}
            />
          ) : (
            <Card
              key={slot.key}
              type="item"
              icon={slot.icon}
              title={slot.title}
              footer="Coming soon"
            />
          ),
        )}
      </div>

      <div className={styles.footer}>
        <Button type="outline" label="Browse everything" href="/projects" />
      </div>

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
                  onClick={() =>
                    setModalIndex((i) =>
                      i === null
                        ? i
                        : (i - 1 + realEntries.length) % realEntries.length,
                    )
                  }
                />
                <span>
                  {(modalIndex ?? 0) + 1} of {realEntries.length}
                </span>
                <Button
                  className={styles.next}
                  icon="moveRight"
                  onClick={() =>
                    setModalIndex((i) =>
                      i === null ? i : (i + 1) % realEntries.length,
                    )
                  }
                />
              </div>
              <div className={styles.links}>
                <a
                  href={modalEntry.sourceUrl ?? GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>
                <Button
                  type="outline"
                  label="Demo"
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

function FeaturedGridCard({
  entry,
  onSelect,
}: {
  entry: FeaturedEntry;
  onSelect: (entry: FeaturedEntry) => void;
}) {
  const { image, description, tags } = useProjectData(
    entry.category,
    entry.slug,
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
