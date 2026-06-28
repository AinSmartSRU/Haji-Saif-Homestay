"use client";

import Image from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  label?: string;
  priority?: boolean;
  sizes?: string;
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  label,
  priority = false,
  sizes = "100vw",
  aspectClassName = "aspect-[4/3]",
  className = "",
  imageClassName = "",
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] bg-stone-100 shadow-[0_16px_40px_rgba(88,69,46,0.08)] ${aspectClassName} ${className}`}
    >
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,_#f8f1e6,_#efe3d0)] p-6 text-center text-sm font-medium text-stone-600">
          Gambar akan dikemaskini
        </div>
      ) : (
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={`object-cover ${imageClassName}`}
            onError={() => setHasError(true)}
          />
          {label ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent px-4 py-4">
              <p className="text-sm font-medium text-white">{label}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
