import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Image } from "../types/common";

export function useImages(collectionName: string, maxImages?: number) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(!!collectionName);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;

    let isMounted = true;

    async function fetchImages() {
      try {
        const collectionRef = collection(db, collectionName);
        const imagesQuery = maxImages ? query(collectionRef, limit(maxImages)) : collectionRef;
        const querySnapshot = await getDocs(imagesQuery);
        const fetchedImages: Image[] = querySnapshot.docs.map((doc) => ({
          src: doc.data().imageUrl,
          alt: doc.data().alt ?? doc.id,
          description: doc.data().description,
        }));

        if (isMounted) {
          setImages(fetchedImages);
        }
      } catch (err) {
        console.error("Error fetching images: ", err);
        if (isMounted) {
          setError("Could not load images");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [collectionName, maxImages]);

  return { images, loading, error };
}
