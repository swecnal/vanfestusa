import type { ImageCrop } from "@/lib/types";
import { isEffectiveCrop, cropToBackgroundStyles } from "@/lib/crop-utils";

interface Props {
  src: string;
  alt: string;
  crop?: ImageCrop | null;
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
  className,
  style,
  loading = "lazy",
  fallbackObjectPosition,
}: Props) {
  if (!isEffectiveCrop(crop)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={
          fallbackObjectPosition
            ? { ...style, objectPosition: fallbackObjectPosition }
            : style
        }
        loading={loading}
      />
    );
  }

  const bgStyles = cropToBackgroundStyles(crop);

  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{
        ...style,
        backgroundImage: `url(${src})`,
        backgroundSize: bgStyles.backgroundSize,
        backgroundPosition: bgStyles.backgroundPosition,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
