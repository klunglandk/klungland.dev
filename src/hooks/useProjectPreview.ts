import { useProjectData } from "./useProjectData";
import { useProjectDocument } from "./useProjectDocument";
import type { Image } from "../types/common";

interface ProjectPreview {
  image?: Image;
  description?: string;
  tags?: string[];
  sourceUrl?: string;
}

// Spotlight entries can come from either the "projects" collection (interactive
// demos, keyed "{category}-{slug}") or their own document within their
// category's collection (write-ups, keyed by slug). Both hooks are always
// called so the ones called stay consistent across renders; only the result
// for the entry's actual kind is used.
export function useProjectPreview(
  category: string,
  slug: string,
  kind?: "document",
): ProjectPreview {
  const demo = useProjectData(category, slug);
  const document = useProjectDocument(category, slug);

  return kind === "document"
    ? {
        image: document.data?.image,
        description: document.data?.description,
        tags: document.data?.tags,
        sourceUrl: document.data?.sourceUrl,
      }
    : demo;
}
