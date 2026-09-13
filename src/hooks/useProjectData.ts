import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Image } from "../types/common";

interface ProjectData {
  category: string;
  slug: string;
  image?: Image;
  description?: string;
  tags?: string[];
  sourceUrl?: string;
}

const EMPTY_DATA: ProjectData = { category: "", slug: "" };

// Shared across every useProjectData call, so a project's data only has to be
// fetched once even though multiple components (grid card, spotlight, modal)
// may ask for the same project around the same time.
const cache = new Map<string, ProjectData>();

export function useProjectData(category: string, slug: string) {
  const [data, setData] = useState<ProjectData>(EMPTY_DATA);

  useEffect(() => {
    if (!category || !slug) return;

    const docId = `${category}-${slug}`;
    if (cache.has(docId)) return;

    let isMounted = true;

    async function fetchData() {
      try {
        const snapshot = await getDoc(doc(db, "projects", docId));
        if (!isMounted) return;

        const docData = snapshot.data();
        const result: ProjectData = {
          category,
          slug,
          image: docData?.imageUrl
            ? { src: docData.imageUrl, alt: docData.title ?? docId }
            : undefined,
          description: docData?.description,
          tags: docData?.tags,
          sourceUrl: docData?.sourceURL,
        };
        cache.set(docId, result);
        setData(result);
      } catch (err) {
        console.error("Error fetching project data: ", err);
        const result: ProjectData = { category, slug };
        cache.set(docId, result);
        if (isMounted) setData(result);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [category, slug]);

  if (!category || !slug) {
    return {
      image: undefined,
      description: undefined,
      tags: undefined,
      loading: false,
    };
  }

  // Prefer the shared cache — if some other component already fetched this
  // project, use that immediately instead of waiting on this instance's own effect.
  const cached = cache.get(`${category}-${slug}`);
  const isCurrent = data.category === category && data.slug === slug;
  const effective = cached ?? (isCurrent ? data : undefined);

  return {
    image: effective?.image,
    description: effective?.description,
    tags: effective?.tags,
    sourceUrl: effective?.sourceUrl,
    loading: !effective,
  };
}
