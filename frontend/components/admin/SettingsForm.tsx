"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminClientPatch } from "@/lib/admin-client";
import type { Pengaturan } from "@/lib/types";
import {
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminField";
import AdminFormActions from "@/components/admin/AdminFormActions";
import AdminMediaUpload from "@/components/admin/AdminMediaUpload";

type Props = {
  settings: Pengaturan;
};

type FormState = Omit<
  Pengaturan,
  | "nomor_whatsapp"
  | "instagram_url"
  | "hero_image"
  | "cta_heading"
  | "cta_description"
> & {
  nomor_whatsapp: string;
  instagram_url: string;
  hero_image: string;
  cta_heading: string;
  cta_description: string;
};

export default function SettingsForm({
  settings,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    ...settings,
    nomor_whatsapp:
      settings.nomor_whatsapp ?? "",
    instagram_url:
      settings.instagram_url ?? "",
    hero_image: settings.hero_image ?? "",
    cta_heading: settings.cta_heading ?? "",
    cta_description:
      settings.cta_description ?? "",
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

    try {
      await adminClientPatch(
        "admin/pengaturan",
        form,
      );
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal menyimpan pengaturan.",
      );
    } finally {
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
            Identitas website
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Informasi dasar yang digunakan di website.
          </p>
        </div>

        <AdminInput
          label="Nama kos"
          required
          value={form.nama_kos}
          onChange={(event) =>
            setField("nama_kos", event.target.value)
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
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
            label="Instagram URL"
            value={form.instagram_url}
            onChange={(event) =>
              setField(
                "instagram_url",
                event.target.value,
              )
            }
          />
        </div>

        <AdminMediaUpload
          label="Hero image"
          value={form.hero_image}
          onChange={(url) =>
            setField("hero_image", url)
          }
          description="Upload gambar utama yang digunakan pada hero halaman depan."
          disabled={loading}
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            Hero section
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Atur teks utama yang tampil di halaman depan.
          </p>
        </div>

        <AdminInput
          label="Headline"
          required
          value={form.hero_headline}
          onChange={(event) =>
            setField(
              "hero_headline",
              event.target.value,
            )
          }
        />

        <AdminTextarea
          label="Subheadline"
          value={form.hero_subheadline}
          onChange={(event) =>
            setField(
              "hero_subheadline",
              event.target.value,
            )
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput
            label="CTA utama"
            value={form.hero_cta_primary}
            onChange={(event) =>
              setField(
                "hero_cta_primary",
                event.target.value,
              )
            }
          />

          <AdminInput
            label="CTA sekunder"
            value={form.hero_cta_secondary}
            onChange={(event) =>
              setField(
                "hero_cta_secondary",
                event.target.value,
              )
            }
          />
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-(--line) bg-white p-4 sm:col-span-2 sm:p-5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-xl">
            CTA bawah halaman
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Ajakan tindakan yang tampil setelah konten utama.
          </p>
        </div>

        <AdminInput
          label="Judul CTA"
          value={form.cta_heading}
          onChange={(event) =>
            setField(
              "cta_heading",
              event.target.value,
            )
          }
        />

        <AdminTextarea
          label="Deskripsi CTA"
          value={form.cta_description}
          onChange={(event) =>
            setField(
              "cta_description",
              event.target.value,
            )
          }
        />

        {error && (
          <div className="rounded-[9px] border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700">
            {error}
          </div>
        )}

        <AdminFormActions
          cancelHref="/admin"
          loading={loading}
          saveLabel="Simpan pengaturan"
        />
      </section>
    </form>
  );
}
