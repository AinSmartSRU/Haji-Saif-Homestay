"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import type { GalleryImage } from "@/lib/imageConfig";

type UnitGalleryProps = {
  images: GalleryImage[];
  unitName: string;
};

export default function UnitGallery({ images, unitName }: UnitGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const selectedImage = images[selectedIndex] ?? images[0];

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  if (!selectedImage) {
    return null;
  }

  function openSelectedImage() {
    setIsLightboxOpen(true);
  }

  function selectImage(index: number) {
    setSelectedIndex(index);
  }

  return (
    <>
      <div className="space-y-3">
        <ImageWithFallback
          src={selectedImage.src}
          alt={selectedImage.alt}
          label={`${selectedImage.label} · Tekan untuk besarkan`}
          aspectClassName="aspect-[16/11]"
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="cursor-zoom-in"
          onClick={openSelectedImage}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openSelectedImage();
            }
          }}
          role="button"
          tabIndex={0}
        />

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-4">
          {images.slice(0, 8).map((image, index) => (
            <ImageWithFallback
              key={image.src}
              src={image.src}
              alt={`Pilih gambar: ${image.alt}`}
              label={image.label}
              aspectClassName="aspect-[4/3]"
              sizes="(min-width: 768px) 12vw, 25vw"
              className={`cursor-pointer rounded-xl transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(88,69,46,0.14)] ${
                selectedIndex === index
                  ? "ring-2 ring-[color:var(--color-accent-deep)] ring-offset-2"
                  : "opacity-85 hover:opacity-100"
              }`}
              onClick={() => selectImage(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectImage(index);
                }
              }}
              role="button"
              tabIndex={0}
            />
          ))}
        </div>
      </div>

      {isLightboxOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Paparan besar gambar ${unitName}`}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Tutup gambar"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:right-8 sm:top-8"
          >
            <X size={22} />
          </button>
          <div
            className="w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ImageWithFallback
              src={selectedImage.src}
              alt={selectedImage.alt}
              label={selectedImage.label}
              aspectClassName="aspect-[16/10]"
              sizes="100vw"
              className="rounded-2xl bg-stone-900 shadow-2xl sm:rounded-3xl"
              imageClassName="object-contain"
            />
            <p className="mt-3 text-center text-sm text-stone-200">
              {selectedImage.label}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
