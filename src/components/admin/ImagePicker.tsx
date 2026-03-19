"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import MediaPickerModal from "./MediaPickerModal";
import ImageCropModal from "./ImageCropModal";
import type { ImageCrop } from "@/lib/types";

interface Props {
  value: string;
  onChange: (url: string) => void;
  cropValue?: ImageCrop | null;
  onCropChange?: (crop: ImageCrop | null) => void;
}

export default function ImagePicker({ value, onChange, cropValue, onCropChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { asset } = await res.json();
        if (asset?.public_url) {
          onChange(asset.public_url);
          onCropChange?.(null); // clear crop when image changes
          toast.success("Image uploaded — remember to Save");
        } else {
          toast.error("Upload succeeded but no URL returned");
        }
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || `Upload failed (${res.status})`);
      }
    } catch (e) {
      toast.error(`Upload error: ${e instanceof Error ? e.message : "network issue"}`);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200">
          <img
            src={value}
            alt=""
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {cropValue && (
            <span className="absolute top-1.5 right-1.5 bg-teal/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              Cropped
            </span>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-white text-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              Replace
            </button>
            <button
              onClick={() => {
                onChange("");
                onCropChange?.(null);
              }}
              className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onCropChange?.(null);
          }}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs min-w-0"
          placeholder="Image URL or upload"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
        >
          {uploading ? "..." : "Upload"}
        </button>
        <button
          onClick={() => setLibraryOpen(true)}
          className="px-3 py-1.5 bg-teal/10 hover:bg-teal/20 text-teal rounded-lg text-xs font-medium transition-colors"
        >
          Library
        </button>
        {onCropChange && value && (
          <button
            onClick={() => setCropOpen(true)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
          >
            {cropValue ? "Edit Crop" : "Crop"}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      <MediaPickerModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={(url) => {
          onChange(url);
          onCropChange?.(null);
          toast.success("Image selected — remember to Save");
        }}
      />

      {onCropChange && (
        <ImageCropModal
          open={cropOpen}
          imageSrc={value}
          initialCrop={cropValue}
          onAccept={(crop) => {
            onCropChange(crop);
            setCropOpen(false);
            toast.success("Crop applied — remember to Save");
          }}
          onClear={() => {
            onCropChange(null);
            setCropOpen(false);
          }}
          onClose={() => setCropOpen(false)}
        />
      )}
    </div>
  );
}
