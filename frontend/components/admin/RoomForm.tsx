"use client";

import {
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  adminClientDelete,
  adminClientPatch,
  adminClientPost,
} from "@/lib/admin-client";

import type {
  Cabang,
  Kamar,
} from "@/lib/types";

import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminField";

import AdminFormActions from "@/components/admin/AdminFormActions";
import RoomPhotoManager from "@/components/admin/RoomPhotoManager";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

type Props = {
  room?: Kamar;
  branches: Cabang[];
};

type FormState = {
  nama: string;
  slug: string;
  tipe: string;
  deskripsi: string;
  harga_bulanan: string;
  periode_harga: string;
  jumlah_kamar: string;
  kamar_tersedia: string;
  ukuran: string;
  url_gambar: string;
  cabang_id: string;
  fasilitas: string;
  urutan: string;
  aktif: boolean;
};

export default function RoomForm({
  room,
  branches,
}: Props) {
  const router = useRouter();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    nama: room?.nama ?? "",
    slug: room?.slug ?? "",
    tipe: room?.tipe ?? "Standar",
    deskripsi: room?.deskripsi ?? "",
    harga_bulanan: String(
      room?.harga_bulanan ?? "",
    ),
    periode_harga:
      room?.periode_harga ?? "bulan",
    jumlah_kamar: String(
      room?.jumlah_kamar ?? 1,
    ),
    kamar_tersedia: String(
      room?.kamar_tersedia ?? 1,
    ),
    ukuran: room?.ukuran ?? "",
    url_gambar: room?.url_gambar ?? "",
    cabang_id: String(
      room?.cabang_id ??
        branches[0]?.id ??
        "",
    ),
    fasilitas: (
      room?.fasilitas ?? []
    ).join("\n"),
    urutan: String(
      room?.urutan ?? 0,
    ),
    aktif: room?.aktif ?? true,
  });

  function setField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const payload = {
      ...form,
      cabang_id: Number(form.cabang_id),
      harga_bulanan: Number(
        form.harga_bulanan,
      ),
      jumlah_kamar: Number(
        form.jumlah_kamar,
      ),
      kamar_tersedia: Number(
        form.kamar_tersedia,
      ),
      urutan: Number(form.urutan),
      fasilitas: form.fasilitas
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean),
    };

    try {
      if (room) {
        await adminClientPatch(
          `admin/kamar/${room.id}`,
          payload,
        );
      } else {
        await adminClientPost(
          "admin/kamar",
          payload,
        );
      }

      router.push(
        room
          ? `/admin/kamar/${room.id}`
          : "/admin/kamar",
      );

      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan data kamar.",
      );

      setLoading(false);
    }
  }

  async function remove() {
    if (!room) {
      return;
    }

    if (
      !window.confirm(
        `Hapus ${room.nama}?`,
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminClientDelete(
        `admin/kamar/${room.id}`,
      );

      router.push("/admin/kamar");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menghapus kamar.",
      );

      setLoading(false);
    }
  }


  return (
    <form
      onSubmit={submit}
      className="grid gap-4"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]">
        <section className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
          <div>
            <h2 className="font-(family-name:--font-fraunces) text-xl">
              Informasi kamar
            </h2>

            <p className="mt-1 text-[11px] text-(--muted)">
              Data utama yang digunakan
              website.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="Nama kamar"
              required
              value={form.nama}
              onChange={(event) =>
                setField(
                  "nama",
                  event.target.value,
                )
              }
              placeholder="Kamar Standar 1"
            />

            <AdminInput
              label="Tipe"
              required
              value={form.tipe}
              onChange={(event) =>
                setField(
                  "tipe",
                  event.target.value,
                )
              }
              placeholder="Standar"
            />

            <AdminSelect
              label="Cabang"
              required
              value={form.cabang_id}
              onChange={(event) =>
                setField(
                  "cabang_id",
                  event.target.value,
                )
              }
            >
              <option value="">
                Pilih cabang
              </option>

              {branches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.nama}
                </option>
              ))}
            </AdminSelect>

            <AdminInput
              label="Ukuran"
              value={form.ukuran}
              onChange={(event) =>
                setField(
                  "ukuran",
                  event.target.value,
                )
              }
              placeholder="3 × 3 m"
            />

            <AdminInput
              label="Harga"
              required
              type="number"
              min="1"
              value={form.harga_bulanan}
              onChange={(event) =>
                setField(
                  "harga_bulanan",
                  event.target.value,
                )
              }
              placeholder="900000"
            />

            <AdminSelect
              label="Periode harga"
              value={form.periode_harga}
              onChange={(event) =>
                setField(
                  "periode_harga",
                  event.target.value,
                )
              }
            >
              <option value="bulan">
                bulan
              </option>

              <option value="minggu">
                minggu
              </option>

              <option value="hari">
                hari
              </option>
            </AdminSelect>

            <AdminInput
              label="Jumlah kamar"
              required
              type="number"
              min="0"
              value={form.jumlah_kamar}
              onChange={(event) =>
                setField(
                  "jumlah_kamar",
                  event.target.value,
                )
              }
            />

            <AdminInput
              label="Kamar tersedia"
              required
              type="number"
              min="0"
              value={
                form.kamar_tersedia
              }
              onChange={(event) =>
                setField(
                  "kamar_tersedia",
                  event.target.value,
                )
              }
            />
          </div>

          <AdminTextarea
            label="Deskripsi"
            value={form.deskripsi}
            onChange={(event) =>
              setField(
                "deskripsi",
                event.target.value,
              )
            }
            placeholder="Jelaskan karakteristik kamar..."
          />

          <AdminTextarea
            label="Fasilitas"
            hint="Satu fasilitas per baris. Nama fasilitas harus sudah terdaftar di sistem."
            value={form.fasilitas}
            onChange={(event) =>
              setField(
                "fasilitas",
                event.target.value,
              )
            }
          />
        </section>

        <section className="grid content-start gap-4">
          <div className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
            <div>
              <h2 className="font-(family-name:--font-fraunces) text-xl">
                Publikasi
              </h2>

              <p className="mt-1 text-[11px] text-(--muted)">
                Atur foto utama, urutan, dan status kamar.
              </p>
            </div>

            <AdminInput
              label="Slug"
              value={form.slug}
              onChange={(event) =>
                setField(
                  "slug",
                  event.target.value,
                )
              }
              placeholder="kamar-standar-1"
            />

            <AdminMediaUpload
              label="Foto utama"
              value={form.url_gambar}
              onChange={(url) =>
                setField("url_gambar", url)
              }
              description="Digunakan sebagai cover kamar pada listing dan halaman publik."
              disabled={loading}
            />

            <AdminInput
              label="Urutan"
              type="number"
              min="0"
              value={form.urutan}
              onChange={(event) =>
                setField(
                  "urutan",
                  event.target.value,
                )
              }
            />

            <label className="flex min-h-11 items-center justify-between rounded-[9px] border border-(--line) px-3.5">
              <span>
                <strong className="block text-xs">
                  Tampilkan di website
                </strong>

                <span className="text-[10px] text-(--muted)">
                  Kamar aktif dapat
                  ditampilkan publik.
                </span>
              </span>

              <input
                type="checkbox"
                checked={form.aktif}
                onChange={(event) =>
                  setField(
                    "aktif",
                    event.target.checked,
                  )
                }
                className="size-4 accent-(--accent)"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-[9px] border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">
              {error}
            </div>
          )}

          <AdminFormActions
            cancelHref={
              room
                ? `/admin/kamar/${room.id}`
                : "/admin/kamar"
            }
            loading={loading}
            saveLabel="Simpan kamar"
            onDelete={
              room ? remove : undefined
            }
          />
        </section>
      </div>

      {room ? (
        <RoomPhotoManager
          roomId={room.id}
        />
      ) : (
        <section className="rounded-xl border border-dashed border-(--line) bg-white p-5">
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Dokumentasi kamar
          </h2>

          <p className="mt-1 text-xs leading-5 text-(--muted)">
            Simpan kamar terlebih dahulu.
            Setelah kamar dibuat, kamu dapat
            menambahkan banyak foto dokumentasi
            khusus untuk kamar tersebut.
          </p>
        </section>
      )}
    </form>
  );
}
