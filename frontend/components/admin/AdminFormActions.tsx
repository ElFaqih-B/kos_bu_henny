"use client";

import { Save, Trash2 } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";

type Props = {
  cancelHref: string;
  loading: boolean;
  saveLabel: string;
  onDelete?: () => void;
  deleteLabel?: string;
};

export default function AdminFormActions({
  cancelHref,
  loading,
  saveLabel,
  onDelete,
  deleteLabel = "Hapus",
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <AdminButton
        href={cancelHref}
        variant="secondary"
      >
        Batal
      </AdminButton>

      <AdminButton
        type="submit"
        disabled={loading}
      >
        <Save size={16} />
        {loading ? "Menyimpan..." : saveLabel}
      </AdminButton>

      {onDelete && (
        <AdminButton
          type="button"
          variant="danger"
          disabled={loading}
          onClick={onDelete}
        >
          <Trash2 size={16} />
          {deleteLabel}
        </AdminButton>
      )}
    </div>
  );
}
