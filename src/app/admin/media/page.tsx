"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  filename: string;
  public_url: string;
  mime_type: string;
  size_bytes: number | null;
  alt_text: string;
  created_at: string;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAssets = () => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        setAssets(data.assets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success(`Uploaded ${file.name}`);
      } else {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    fetchAssets();
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`Delete ${asset.filename}?`)) return;
    const res = await fetch(`/api/media/${asset.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      fetchAssets();
    }
  };

  const handleUpdateAlt = async (assetId: string, altText: string) => {
    await fetch(`/api/media/${assetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text: altText }),
    });
    setEditingAlt(null);
    toast.success("Alt text updated");
    fetchAssets();
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-charcoal">
          Media Library
        </h2>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-teal hover:bg-teal-dark text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-teal transition-colors"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-teal", "bg-teal/5");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-teal", "bg-teal/5");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-teal", "bg-teal/5");
          if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
        }}
      >
        <p className="text-gray-400 text-sm">
          Drag and drop images here, or click Upload Images above
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading...</div>
      ) : assets.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No images uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
            >
              <div className="aspect-square relative">
                <img
                  src={asset.public_url}
                  alt={asset.alt_text}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(asset.public_url);
                      toast.success("URL copied");
                    }}
                    className="bg-white text-charcoal text-xs px-2 py-1 rounded font-medium"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(asset)}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-charcoal truncate font-medium">
                  {asset.filename}
                </p>
                <p className="text-[10px] text-gray-400">
                  {formatSize(asset.size_bytes)}
                </p>
                {editingAlt === asset.id ? (
                  <input
                    type="text"
                    defaultValue={asset.alt_text}
                    className="mt-1 w-full text-xs px-1.5 py-1 border border-gray-200 rounded"
                    autoFocus
                    onBlur={(e) =>
                      handleUpdateAlt(asset.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleUpdateAlt(
                          asset.id,
                          (e.target as HTMLInputElement).value
                        );
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setEditingAlt(asset.id)}
                    className="mt-1 text-[10px] text-gray-400 hover:text-teal transition-colors"
                  >
                    {asset.alt_text || "Add alt text"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
