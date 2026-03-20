import type { ImageCrop, ImageFit } from "@/lib/types";
import { isEffectiveCrop } from "@/lib/crop-utils";

interface Props {
  src: string;
  alt: string;
  crop?: ImageCrop | null;
  imageFit?: ImageFit;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  /** Fallback object-position when no crop (e.g. legacy "top center") */
  fallbackObjectPosition?: string;
}

export default function CroppedImage({
  src,
  alt,
  crop,
  imageFit,
  className,
  style,
  loading = "lazy",
  fallbackObjectPosition,
}: Props) {
  const fit = imageFit || "cover";
  const objectFit = fit === "fill" ? ("fill" as const) : fit;

  if (!isEffectiveCrop(crop)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          objectFit,
          ...(fallbackObjectPosition ? { objectPosition: fallbackObjectPosition } : {}),
        }}
        loading={loading}
      />
    );
  }

  // Use object-view-box to crop, then object-fit controls how cropped region fills container
  const top = crop.y;
  const right = 100 - crop.x - crop.width;
  const bottom = 100 - crop.y - crop.height;
  const left = crop.x;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        objectFit,
        objectViewBox: `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}%)`,
      } as React.CSSProperties}
      loading={loading}
    />
  );
}
