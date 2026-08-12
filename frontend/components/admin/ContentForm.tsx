"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminClientPatch, adminClientPost } from "@/lib/admin-client";
import type { KontenHalaman } from "@/lib/types";
import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminField";
import AdminFormActions from "@/components/admin/AdminFormActions";

type Props = {
  content?: KontenHalaman;
};

type FormState = {
  kunci: string;
  judul: string;
  isi: string;
  urutan: string;
  aktif: boolean;
};

export default function ContentForm({
  content,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    kunci: content?.kunci ?? "",
    judul: content?.judul ?? "",
    isi: content?.isi ?? "",
    urutan: String(content?.urutan ?? 0),
    aktif: content?.aktif ?? true,
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
      if (content) {
        await adminClientPatch(
          `admin/konten/${content.id}`,
          payload,
        );
      } else {
        await adminClientPost(
          "admin/konten",
          payload,
        );
      }

      router.push(
        content
          ? `/admin/konten/${content.id}`
          : "/admin/konten",
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan konten.",
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
            Isi halaman
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Gunakan kunci yang stabil agar konten mudah
            dirujuk frontend.
          </p>
        </div>

        <AdminInput
          label="Kunci konten"
          required
          value={form.kunci}
          onChange={(event) =>
            setField("kunci", event.target.value)
          }
          placeholder="tentang_kos"
        />

        <AdminInput
          label="Judul"
          value={form.judul}
          onChange={(event) =>
            setField("judul", event.target.value)
          }
        />

        <AdminTextarea
          label="Isi"
          value={form.isi}
          onChange={(event) =>
            setField("isi", event.target.value)
          }
          className="min-h-56"
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Publikasi
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Tentukan urutan dan apakah konten aktif.
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
          <span className="text-xs font-semibold">
            Konten aktif
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
            content
              ? `/admin/konten/${content.id}`
              : "/admin/konten"
          }
          loading={loading}
          saveLabel="Simpan konten"
        />
      </section>
    </form>
  );
}
