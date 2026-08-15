"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

import { adminClientUpload } from "@/lib/admin-client";
import {
  IMAGE_UPLOAD_ACCEPT,
  isHeicFile,
  prepareUploadFile,
} from "@/lib/image-upload";
import { mediaUrl } from "@/lib/media";
import type { UploadResponse } from "@/lib/types";

type Props = {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  description?: string;
  accept?: string;
  disabled?: boolean;
};

export default function AdminMediaUpload({
  label,
  value,
  onChange,
  description,
  accept = IMAGE_UPLOAD_ACCEPT,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const preview = mediaUrl(value);

  function openPicker() {
    if (!disabled && !uploading) {
      inputRef.current?.click();
    }
  }

  async function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const wasHeic = isHeicFile(file);
      const uploadFile = await prepareUploadFile(file);
      const uploaded =
        await adminClientUpload<UploadResponse>(
          "admin/upload",
          uploadFile,
        );

      onChange(uploaded.url);
      setSuccess(
        wasHeic
          ? "Foto HEIC berhasil dikonversi dan diupload."
          : "Foto berhasil diupload.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal mengupload foto.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-(--ink)">
            {label}
          </p>

          {description && (
            <p className="mt-1 text-[10px] leading-4 text-(--muted)">
              {description}
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
          disabled={disabled || uploading}
        />

        <button
          type="button"
          disabled={disabled || uploading}
          onClick={openPicker}
          className="shrink-0 rounded-[9px] bg-(--ink) px-3.5 py-2.5 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Mengupload..."
            : preview
              ? "Ganti foto"
              : "Upload foto"}
        </button>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-(--line) bg-(--background)">
        {preview ? (
          <div className="relative aspect-16/10 w-full">
            <Image
              src={preview}
              alt={label}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-16/10 items-center justify-center px-4 text-center">
            <div>
              <p className="text-xs font-semibold text-(--ink)">
                Belum ada foto
              </p>

              <p className="mt-1 text-[10px] leading-4 text-(--muted)">
                JPG, PNG, WebP, AVIF, atau HEIC/HEIF.
              </p>
            </div>
          </div>
        )}
      </div>

      {success && (
        <p className="text-[10px] leading-4 text-green-700">
          {success}
        </p>
      )}

      {error && (
        <p className="text-[10px] leading-4 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
