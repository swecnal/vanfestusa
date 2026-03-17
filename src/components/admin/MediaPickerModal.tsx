"use client";

import { useState, useEffect, useRef } from "react";

interface MediaAsset {
  id: string;
  public_url: string;
  filename: string;
  mime_type: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  accept?: string; // e.g. "image/*"
}

export default function MediaPickerModal({ open, onClose, onSelect, accept = "image/*" }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/media")
      .then((r) => r.json())
      .then((res) => {
        const all = (res.assets || []) as MediaAsset[];
        // Filter to images only
        setAssets(all.filter((a) => a.mime_type.startsWith("image/")));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const { asset } = await res.json();
      if (asset?.public_url) {
        onSelect(asset.public_url);
        onClose();
      }
    } catch {
      // Upload failed — user can try again
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="font-display font-bold text-sm text-charcoal">Media Library</h3>
          <div className="flex items-center gap-3">
            <label className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${uploading ? "bg-gray-100 text-gray-400" : "bg-teal text-white hover:bg-teal-dark"}`}>
              {uploading ? "Uploading..." : "Upload New"}
              <input ref={fileRef} type="file" accept={accept} onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <button onClick={onClose} className="text-gray-400 hover:text-charcoal">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading media...</div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No images uploaded yet</div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => { onSelect(asset.public_url); onClose(); }}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-teal transition-colors bg-gray-100"
                >
                  <img src={asset.public_url} alt={asset.filename} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                    <span className="w-full text-[9px] text-white bg-black/60 px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {asset.filename}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
