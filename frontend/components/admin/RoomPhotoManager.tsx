"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  adminClientDelete,
  adminClientGet,
  adminClientPatch,
  adminClientPost,
  adminClientUpload,
} from "@/lib/admin-client";

import type {
  KamarFoto,
  UploadResponse,
} from "@/lib/types";

import { mediaUrl } from "@/lib/media";

type Props = {
  roomId: number;
};

type PhotoDraft = {
  caption: string;
  teks_alt: string;
  urutan: string;
  aktif: boolean;
};

function getDefaultAlt(fileName: string): string {
  const cleaned = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "Foto kamar";
}

export default function RoomPhotoManager({
  roomId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<KamarFoto[]>(
    [],
  );

  const [drafts, setDrafts] = useState<
    Record<number, PhotoDraft>
  >({});

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<
    number | null
  >(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadPhotos() {
    setLoading(true);
    setError("");

    try {
      const data = await adminClientGet<KamarFoto[]>(
        `admin/kamar/${roomId}/foto`,
      );

      setPhotos(data);

      const nextDrafts: Record<number, PhotoDraft> = {};

      for (const photo of data) {
        nextDrafts[photo.id] = {
          caption: photo.caption ?? "",
          teks_alt: photo.teks_alt,
          urutan: String(photo.urutan),
          aktif: photo.aktif,
        };
      }

      setDrafts(nextDrafts);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal memuat dokumentasi kamar.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPhotos();
  }, [roomId]);

  function updateDraft(
    photoId: number,
    key: keyof PhotoDraft,
    value: string | boolean,
  ) {
    setDrafts((current) => ({
      ...current,
      [photoId]: {
        ...current[photoId],
        [key]: value,
      },
    }));
  }

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (!files.length) {
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      let nextOrder =
        photos.reduce(
          (highest, photo) =>
            Math.max(highest, photo.urutan),
          -1,
        ) + 1;

      for (const file of files) {
        const uploaded =
          await adminClientUpload<UploadResponse>(
            "admin/upload",
            file,
          );

        await adminClientPost<KamarFoto>(
          `admin/kamar/${roomId}/foto`,
          {
            path_foto: uploaded.url,
            caption: null,
            teks_alt: getDefaultAlt(file.name),
            urutan: nextOrder,
            aktif: true,
          },
        );

        nextOrder += 1;
      }

      setSuccess(
        files.length === 1
          ? "Foto berhasil ditambahkan."
          : `${files.length} foto berhasil ditambahkan.`,
      );

      await loadPhotos();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal mengupload foto.",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function savePhoto(photoId: number) {
    const draft = drafts[photoId];

    if (!draft) {
      return;
    }

    if (!draft.teks_alt.trim()) {
      setError("Teks alt tidak boleh kosong.");
      return;
    }

    setSavingId(photoId);
    setError("");
    setSuccess("");

    try {
      await adminClientPatch<KamarFoto>(
        `admin/kamar/${roomId}/foto/${photoId}`,
        {
          caption:
            draft.caption.trim() || null,
          teks_alt: draft.teks_alt.trim(),
          urutan: Number(draft.urutan),
          aktif: draft.aktif,
        },
      );

      setSuccess("Informasi foto berhasil disimpan.");

      await loadPhotos();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan foto.",
      );
    } finally {
      setSavingId(null);
    }
  }

  async function replacePhoto(
    photoId: number,
    file: File,
  ) {
    setSavingId(photoId);
    setError("");
    setSuccess("");

    try {
      const uploaded =
        await adminClientUpload<UploadResponse>(
          "admin/upload",
          file,
        );

      const draft = drafts[photoId];

      await adminClientPatch<KamarFoto>(
        `admin/kamar/${roomId}/foto/${photoId}`,
        {
          path_foto: uploaded.url,
          teks_alt:
            draft?.teks_alt.trim() ||
            getDefaultAlt(file.name),
        },
      );

      setSuccess("Foto berhasil diganti.");

      await loadPhotos();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal mengganti foto.",
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(photo: KamarFoto) {
    if (
      !window.confirm(
        "Hapus dokumentasi foto ini? Foto akan dihapus dari kamar.",
      )
    ) {
      return;
    }

    setDeletingId(photo.id);
    setError("");
    setSuccess("");

    try {
      await adminClientDelete(
        `admin/kamar/${roomId}/foto/${photo.id}`,
      );

      setSuccess("Foto berhasil dihapus.");

      await loadPhotos();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menghapus foto.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="grid gap-5 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Dokumentasi kamar
          </h2>

          <p className="mt-1 max-w-2xl text-[11px] leading-5 text-(--muted)">
            Tambahkan beberapa foto khusus untuk kamar
            ini agar calon penghuni dapat melihat kondisi
            kamar secara lebih jelas.
          </p>
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-(--ink) px-4 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Mengupload..."
              : "+ Tambah foto"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[9px] border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-[9px] border border-green-200 bg-green-50 px-3.5 py-3 text-xs leading-5 text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-[10px] border border-(--line) px-4 py-8 text-center text-xs text-(--muted)">
          Memuat dokumentasi...
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-(--line) px-4 py-10 text-center">
          <p className="text-sm font-semibold text-(--ink)">
            Belum ada dokumentasi
          </p>

          <p className="mt-1 text-xs leading-5 text-(--muted)">
            Upload beberapa foto kamar dari tombol
            &quot;+ Tambah foto&quot;.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {photos.map((photo) => {
            const draft = drafts[photo.id];
            const image = mediaUrl(
              photo.path_foto,
            );

            const isSaving =
              savingId === photo.id;

            const isDeleting =
              deletingId === photo.id;

            return (
              <article
                key={photo.id}
                className="overflow-hidden rounded-[10px] border border-(--line)"
              >
                <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="relative aspect-4/3 bg-(--background) lg:aspect-auto">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          photo.teks_alt ||
                          "Foto kamar"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-52 items-center justify-center px-4 text-center text-xs text-(--muted)">
                        Foto tidak tersedia
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-(--ink)">
                          Foto #{photo.urutan + 1}
                        </p>

                        <p className="mt-0.5 text-[10px] text-(--muted)">
                          ID foto: {photo.id}
                        </p>
                      </div>

                      <label className="flex min-h-9 items-center gap-2 rounded-[9px] border border-(--line) px-3 text-[11px]">
                        <input
                          type="checkbox"
                          checked={
                            draft?.aktif ?? photo.aktif
                          }
                          onChange={(event) =>
                            updateDraft(
                              photo.id,
                              "aktif",
                              event.target.checked,
                            )
                          }
                          className="size-4 accent-(--accent)"
                        />

                        <span>Aktif</span>
                      </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1.5">
                        <span className="text-[11px] font-semibold text-(--ink)">
                          Caption
                        </span>

                        <input
                          value={
                            draft?.caption ?? ""
                          }
                          onChange={(event) =>
                            updateDraft(
                              photo.id,
                              "caption",
                              event.target.value,
                            )
                          }
                          placeholder="Contoh: Area tempat tidur"
                          maxLength={255}
                          className="min-h-10 rounded-[9px] border border-(--line) bg-white px-3 text-xs outline-none transition focus:border-(--accent)"
                        />
                      </label>

                      <label className="grid gap-1.5">
                        <span className="text-[11px] font-semibold text-(--ink)">
                          Urutan
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            draft?.urutan ??
                            photo.urutan
                          }
                          onChange={(event) =>
                            updateDraft(
                              photo.id,
                              "urutan",
                              event.target.value,
                            )
                          }
                          className="min-h-10 rounded-[9px] border border-(--line) bg-white px-3 text-xs outline-none transition focus:border-(--accent)"
                        />
                      </label>
                    </div>

                    <label className="grid gap-1.5">
                      <span className="text-[11px] font-semibold text-(--ink)">
                        Teks alt
                      </span>

                      <input
                        value={
                          draft?.teks_alt ??
                          photo.teks_alt
                        }
                        onChange={(event) =>
                          updateDraft(
                            photo.id,
                            "teks_alt",
                            event.target.value,
                          )
                        }
                        placeholder="Deskripsi foto untuk aksesibilitas"
                        maxLength={255}
                        className="min-h-10 rounded-[9px] border border-(--line) bg-white px-3 text-xs outline-none transition focus:border-(--accent)"
                      />
                    </label>

                    <div className="flex flex-wrap gap-2 border-t border-(--line) pt-4">
                      <button
                        type="button"
                        disabled={
                          isSaving ||
                          isDeleting
                        }
                        onClick={() =>
                          savePhoto(photo.id)
                        }
                        className="min-h-10 rounded-[9px] bg-(--ink) px-3.5 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving
                          ? "Menyimpan..."
                          : "Simpan"}
                      </button>

                      <label
                        className={`inline-flex min-h-10 cursor-pointer items-center rounded-[9px] border border-(--line) px-3.5 text-[11px] font-semibold text-(--ink) transition hover:bg-(--background) ${
                          isSaving || isDeleting
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      >
                        Ganti foto
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          disabled={
                            isSaving ||
                            isDeleting
                          }
                          onChange={(
                            event,
                          ) => {
                            const file =
                              event.target.files?.[0];

                            if (file) {
                              void replacePhoto(
                                photo.id,
                                file,
                              );
                            }

                            event.target.value =
                              "";
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        disabled={
                          isSaving ||
                          isDeleting
                        }
                        onClick={() =>
                          void handleDelete(
                            photo,
                          )
                        }
                        className="min-h-10 rounded-[9px] border border-red-200 px-3.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting
                          ? "Menghapus..."
                          : "Hapus"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}