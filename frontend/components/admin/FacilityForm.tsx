"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  adminClientDelete,
  adminClientPatch,
  adminClientPost,
} from "@/lib/admin-client";
import type { Fasilitas } from "@/lib/types";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminField";
import AdminFormActions from "@/components/admin/AdminFormActions";

type Props = {
  facility?: Fasilitas;
};

type FormState = {
  nama: string;
  ikon: string;
  kategori: string;
  deskripsi: string;
  urutan: string;
  aktif: boolean;
};

export default function FacilityForm({
  facility,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    nama: facility?.nama ?? "",
    ikon: facility?.ikon ?? "",
    kategori: facility?.kategori ?? "Umum",
    deskripsi: facility?.deskripsi ?? "",
    urutan: String(facility?.urutan ?? 0),
    aktif: facility?.aktif ?? true,
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
      urutan: Number(form.urutan),
    };

    try {
      if (facility) {
        await adminClientPatch(
          `admin/fasilitas/${facility.id}`,
          payload,
        );
      } else {
        await adminClientPost(
          "admin/fasilitas",
          payload,
        );
      }

      router.push(
        facility
          ? `/admin/fasilitas/${facility.id}`
          : "/admin/fasilitas",
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan fasilitas.",
      );
      setLoading(false);
    }
  }

  async function remove() {
    if (!facility) return;

    if (!window.confirm(`Hapus ${facility.nama}?`)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminClientDelete(
        `admin/fasilitas/${facility.id}`,
      );
      router.push("/admin/fasilitas");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menghapus fasilitas.",
      );
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 lg:grid-cols-2"
    >
      <section className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Detail fasilitas
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Informasi yang digunakan pada data kamar.
          </p>
        </div>

        <AdminInput
          label="Nama"
          required
          value={form.nama}
          onChange={(event) =>
            setField("nama", event.target.value)
          }
          placeholder="AC"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput
            label="Ikon"
            value={form.ikon}
            onChange={(event) =>
              setField("ikon", event.target.value)
            }
            placeholder="snowflake"
          />

          <AdminSelect
            label="Kategori"
            value={form.kategori}
            onChange={(event) =>
              setField("kategori", event.target.value)
            }
          >
            <option>Umum</option>
            <option>Kamar</option>
            <option>Kamar mandi</option>
            <option>Keamanan</option>
            <option>Parkir</option>
            <option>Internet</option>
            <option>Lainnya</option>
          </AdminSelect>
        </div>

        <AdminTextarea
          label="Deskripsi"
          value={form.deskripsi}
          onChange={(event) =>
            setField("deskripsi", event.target.value)
          }
        />
      </section>

      <section className="grid content-start gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Tampilan
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Atur urutan dan visibilitas fasilitas.
          </p>
        </div>

        <AdminInput
          label="Urutan"
          type="number"
          min="0"
          value={form.urutan}
          onChange={(event) =>
            setField("urutan", event.target.value)
          }
        />

        <label className="flex min-h-11 items-center justify-between rounded-[9px] border border-(--line) px-3.5">
          <span>
            <strong className="block text-xs">
              Aktif
            </strong>
            <span className="text-[10px] text-(--muted)">
              Tampilkan fasilitas pada website.
            </span>
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
            facility
              ? `/admin/fasilitas/${facility.id}`
              : "/admin/fasilitas"
          }
          loading={loading}
          saveLabel="Simpan fasilitas"
          onDelete={facility ? remove : undefined}
        />
      </section>
    </form>
  );
}
