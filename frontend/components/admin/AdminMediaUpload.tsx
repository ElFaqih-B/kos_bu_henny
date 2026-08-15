"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import heic2any from "heic2any";

import { adminClientUpload } from "@/lib/admin-client";
import type { UploadResponse } from "@/lib/types";
import { mediaUrl } from "@/lib/media";

type Props = {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  description?: string;
  accept?: string;
  disabled?: boolean;
};

const DEFAULT_ACCEPT =
  "image/jpeg,image/png,image/webp,image/heic,image/heif";

function isHeicFile(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

async function prepareUploadFile(file: File): Promise<File> {
  if (!isHeicFile(file)) {
    return file;
  }

  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const jpegBlob = Array.isArray(converted)
    ? converted[0]
    : converted;

  if (!jpegBlob) {
    throw new Error("Gagal mengonversi gambar HEIC.");
  }

  const jpegName = file.name.replace(
    /\.(heic|heif)$/i,
    ".jpg",
  );

  return new File(
    [jpegBlob],
    jpegName,
    {
      type: "image/jpeg",
    },
  );
}

export default function AdminMediaUpload({
  label,
  value,
  onChange,
  description,
  accept = DEFAULT_ACCEPT,
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
      const uploadFile = await prepareUploadFile(file);

      const uploaded =
        await adminClientUpload<UploadResponse>(
          "admin/upload",
          uploadFile,
        );

      onChange(uploaded.url);

      setSuccess(
        isHeicFile(file)
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

      // Memungkinkan user memilih file yang sama lagi.
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
          <img
            src={preview}
            alt={label}
            className="aspect-16/10 w-full object-cover"
          />
        ) : (
          <div className="flex aspect-16/10 items-center justify-center px-4 text-center">
            <div>
              <p className="text-xs font-semibold text-(--ink)">
                Belum ada foto
              </p>

              <p className="mt-1 text-[10px] leading-4 text-(--muted)">
                JPG, PNG, WebP, atau HEIC.
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