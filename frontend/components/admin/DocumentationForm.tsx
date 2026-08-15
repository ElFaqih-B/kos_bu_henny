"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  adminClientDelete,
  adminClientPatch,
  adminClientPost,
} from "@/lib/admin-client";
import type {
  Cabang,
  Dokumentasi,
} from "@/lib/types";
import {
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminField";
import AdminFormActions from "@/components/admin/AdminFormActions";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

type Props = {
  item?: Dokumentasi;
  branches: Cabang[];
};

type FormState = {
  cabang_id: string;
  path_foto: string;
  caption: string;
  teks_alt: string;
  urutan: string;
  aktif: boolean;
};

export default function DocumentationForm({
  item,
  branches,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    cabang_id:
      item?.cabang_id !== null &&
      item?.cabang_id !== undefined
        ? String(item.cabang_id)
        : "",
    path_foto: item?.path_foto ?? "",
    caption: item?.caption ?? "",
    teks_alt: item?.teks_alt ?? "",
    urutan: String(item?.urutan ?? 0),
    aktif: item?.aktif ?? true,
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
      cabang_id: form.cabang_id
        ? Number(form.cabang_id)
        : null,
      urutan: Number(form.urutan),
    };

    try {
      if (item) {
        await adminClientPatch(
          `admin/dokumentasi/${item.id}`,
          payload,
        );
      } else {
        await adminClientPost(
          "admin/dokumentasi",
          payload,
        );
      }

      router.push(
        item
          ? `/admin/dokumentasi/${item.id}`
          : "/admin/dokumentasi",
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan dokumentasi.",
      );
      setLoading(false);
    }
  }

  async function remove() {
    if (!item) return;

    if (!window.confirm("Hapus dokumentasi ini?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminClientDelete(
        `admin/dokumentasi/${item.id}`,
      );
      router.push("/admin/dokumentasi");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menghapus dokumentasi.",
      );
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 lg:max-w-3xl"
    >
      <section className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Media dokumentasi
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Upload foto dokumentasi yang akan ditampilkan
            pada website.
          </p>
        </div>

        <AdminMediaUpload
          label="Foto dokumentasi"
          value={form.path_foto}
          onChange={(url) =>
            setField("path_foto", url)
          }
          description="Foto akan diupload dan URL media diisi otomatis."
          disabled={loading}
        />

        <AdminInput
          label="Caption"
          value={form.caption}
          onChange={(event) =>
            setField("caption", event.target.value)
          }
        />

        <AdminInput
          label="Teks alternatif"
          required
          value={form.teks_alt}
          onChange={(event) =>
            setField("teks_alt", event.target.value)
          }
          hint="Gunakan deskripsi singkat yang jelas untuk aksesibilitas."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Cabang"
            value={form.cabang_id}
            onChange={(event) =>
              setField(
                "cabang_id",
                event.target.value,
              )
            }
          >
            <option value="">Semua cabang</option>
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
            label="Urutan"
            type="number"
            min="0"
            value={form.urutan}
            onChange={(event) =>
              setField("urutan", event.target.value)
            }
          />
        </div>

        <label className="flex min-h-11 items-center justify-between rounded-[9px] border border-(--line) px-3.5">
          <span className="text-xs font-semibold">
            Dokumentasi aktif
          </span>
          <input
            type="checkbox"
            checked={form.aktif}
            onChange={(event) =>
              setField("aktif", event.target.checked)
            }
            className="size-4 accent-(--accent)"
          />
        </label>

        {error && (
          <div className="rounded-[9px] border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700">
            {error}
          </div>
        )}

        <AdminFormActions
          cancelHref={
            item
              ? `/admin/dokumentasi/${item.id}`
              : "/admin/dokumentasi"
          }
          loading={loading}
          saveLabel="Simpan dokumentasi"
          onDelete={item ? remove : undefined}
        />
      </section>
    </form>
  );
}
