"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import MediaPickerModal from "./MediaPickerModal";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImagePicker({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
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
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-white text-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              Replace
            </button>
            <button
              onClick={() => onChange("")}
              className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
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
          toast.success("Image selected — remember to Save");
        }}
      />
    </div>
  );
}
