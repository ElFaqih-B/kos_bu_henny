"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Cabang } from "@/lib/types";
import {
  adminClientDelete,
  adminClientPatch,
  adminClientPost,
} from "@/lib/admin-client";
import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminField";
import AdminFormActions from "@/components/admin/AdminFormActions";

type Props = {
  branch?: Cabang;
};

type FormState = {
  nama: string;
  kota: string;
  alamat: string;
  deskripsi: string;
  patokan: string;
  nomor_whatsapp: string;
  url_maps: string;
  url_gambar: string;
  urutan: string;
  aktif: boolean;
};

export default function BranchForm({
  branch,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    nama: branch?.nama ?? "",
    kota: branch?.kota ?? "",
    alamat: branch?.alamat ?? "",
    deskripsi: branch?.deskripsi ?? "",
    patokan: branch?.patokan ?? "",
    nomor_whatsapp:
      branch?.nomor_whatsapp ?? "",
    url_maps: branch?.url_maps ?? "",
    url_gambar: branch?.url_gambar ?? "",
    urutan: String(branch?.urutan ?? 0),
    aktif: branch?.aktif ?? true,
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
      if (branch) {
        await adminClientPatch(
          `admin/cabang/${branch.id}`,
          payload,
        );
      } else {
        await adminClientPost(
          "admin/cabang",
          payload,
        );
      }

      router.push(
        branch
          ? `/admin/cabang/${branch.id}`
          : "/admin/cabang",
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan cabang.",
      );
      setLoading(false);
    }
  }

  async function remove() {
    if (!branch) return;

    if (!window.confirm(`Hapus ${branch.nama}?`)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await adminClientDelete(
        `admin/cabang/${branch.id}`,
      );
      router.push("/admin/cabang");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menghapus cabang.",
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
            Informasi lokasi
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Data dasar lokasi cabang yang ditampilkan
            pada website.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput
            label="Nama cabang"
            required
            value={form.nama}
            onChange={(event) =>
              setField("nama", event.target.value)
            }
          />

          <AdminInput
            label="Kota"
            required
            value={form.kota}
            onChange={(event) =>
              setField("kota", event.target.value)
            }
          />
        </div>

        <AdminInput
          label="Alamat"
          required
          value={form.alamat}
          onChange={(event) =>
            setField("alamat", event.target.value)
          }
        />

        <AdminTextarea
          label="Deskripsi"
          value={form.deskripsi}
          onChange={(event) =>
            setField("deskripsi", event.target.value)
          }
        />

        <AdminInput
          label="Patokan"
          value={form.patokan}
          onChange={(event) =>
            setField("patokan", event.target.value)
          }
        />
      </section>

      <section className="grid content-start gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Kontak & publikasi
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Atur informasi kontak dan status cabang.
          </p>
        </div>

        <AdminInput
          label="WhatsApp"
          value={form.nomor_whatsapp}
          onChange={(event) =>
            setField(
              "nomor_whatsapp",
              event.target.value,
            )
          }
        />

        <AdminInput
          label="Google Maps URL"
          value={form.url_maps}
          onChange={(event) =>
            setField("url_maps", event.target.value)
          }
        />

        <AdminInput
          label="URL gambar"
          value={form.url_gambar}
          onChange={(event) =>
            setField(
              "url_gambar",
              event.target.value,
            )
          }
        />

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
          <span className="text-xs font-semibold">
            Cabang aktif
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
          <div className="rounded-[9px] border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">
            {error}
          </div>
        )}

        <AdminFormActions
          cancelHref={
            branch
              ? `/admin/cabang/${branch.id}`
              : "/admin/cabang"
          }
          loading={loading}
          saveLabel="Simpan cabang"
          onDelete={branch ? remove : undefined}
        />
      </section>
    </form>
  );
}
