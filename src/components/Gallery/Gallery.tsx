import { useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { useImages } from "../../hooks/useImages";

interface GalleryProps {
  collectionName: string;
}

export default function Gallery({ collectionName }: GalleryProps) {
  const { images, loading, error } = useImages(collectionName);

  useEffect(() => {
    if (loading || images.length === 0) return;

    const swiper = new Swiper(".swiper", {
      direction: "horizontal",
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      effect: "coverflow",
      coverflowEffect: {
        rotate: 50,
        depth: 100,
        stretch: 0,
        slideShadows: true,
      },
      autoplay: {
        delay: 4000,
        pauseOnMouseEnter: true,
      },
      slidesPerGroup: 1,
      slidesPerView: "auto",
      centeredSlides: true,
      parallax: true,
    });

    return () => {
      swiper.destroy();
    };
  }, [loading, images]);

  if (loading) {
    return <div>Loading images...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (images.length === 0) {
    return <div>No images found</div>;
  }

  return (
    <div className="swiper">
      <div className="swiper-wrapper">
        {images.map((image) => (
          <div className="swiper-slide" key={image.src}>
            <img
              src={image.src}
              alt={image.alt}
              onLoad={(e) => e.currentTarget.classList.add("loaded")}
            />
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  );
}
