import { useMemo } from "react";
import Spotlight, {
  type SpotlightEntry,
} from "../../../components/Spotlight/Spotlight";
import { ProjectRegistry } from "../../../config/projectRegistry";

const MAX_ITEMS = 5;

function getFeaturedEntries(): SpotlightEntry[] {
  return Object.entries(ProjectRegistry)
    .flatMap(([category, entries]) =>
      Object.entries(entries).map(([slug, entry]) => ({ category, slug, entry })),
    )
    .sort((a, b) => b.entry.addedAt.localeCompare(a.entry.addedAt))
    .slice(0, MAX_ITEMS)
    .map(({ category, slug, entry }) => ({
      key: `${category}:${slug}`,
      category,
      slug,
      title: entry.title,
      kind: entry.kind,
      sourceUrl: entry.sourceUrl,
      demoUrl: entry.demoUrl,
    }));
}

export default function FeaturedProjects() {
  const entries = useMemo(() => getFeaturedEntries(), []);

  return (
    <Spotlight entries={entries} maxItems={MAX_ITEMS} browseHref="/projects" />
  );
}
