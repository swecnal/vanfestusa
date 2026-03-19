import type { ImageCrop } from "./types";

/** Check whether crop data represents an actual crop (not full image) */
export function isEffectiveCrop(crop?: ImageCrop | null): crop is ImageCrop {
  if (!crop) return false;
  return !(crop.x === 0 && crop.y === 0 && crop.width === 100 && crop.height === 100);
}

/** Convert ImageCrop to CSS background-size and background-position */
export function cropToBackgroundStyles(crop: ImageCrop): {
  backgroundSize: string;
  backgroundPosition: string;
} {
  const bgSizeW = 10000 / crop.width;
  const bgSizeH = 10000 / crop.height;
  const bgPosX = crop.width < 100 ? (crop.x * 100) / (100 - crop.width) : 0;
  const bgPosY = crop.height < 100 ? (crop.y * 100) / (100 - crop.height) : 0;
  return {
    backgroundSize: `${bgSizeW}% ${bgSizeH}%`,
    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
  };
}
