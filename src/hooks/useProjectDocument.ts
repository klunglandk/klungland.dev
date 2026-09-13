import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Image } from "../types/common";

export interface ProjectDocument {
  image?: Image;
  subtitle?: string;
  description?: string;
  paragraph?: string[];
  tags?: string[];
  sourceUrl?: string;
}

export function useProjectDocument(collectionName: string, docId: string) {
  const [data, setData] = useState<ProjectDocument | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const snapshot = await getDoc(doc(db, collectionName, docId));
        const docData = snapshot.data();
        if (isMounted) {
          setData({
            image: docData?.imageUrl
              ? { src: docData.imageUrl, alt: docData.title ?? docId }
              : undefined,
            subtitle: docData?.subtitle,
            description: docData?.description,
            paragraph: docData?.paragraph,
            tags: docData?.tags,
            sourceUrl: docData?.sourceURL,
          });
        }
      } catch (err) {
        console.error("Error fetching project document: ", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [collectionName, docId]);

  return { data, loading };
}
