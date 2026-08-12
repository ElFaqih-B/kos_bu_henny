import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import RoomForm from "@/components/admin/RoomForm";
import {
  adminServerGet,
  adminServerGetById,
} from "@/lib/admin-server-api";
import type {
  Cabang,
  Kamar,
} from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditKamarPage({
  params,
}: Props) {
  const { id } = await params;
  const roomId = Number(id);

  const [room, branches] = await Promise.all([
    adminServerGetById<Kamar>(
      "admin/kamar",
      roomId,
    ),
    adminServerGet<Cabang[]>("admin/cabang"),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Kamar"
        title={`Edit ${room.nama}`}
        description="Perbarui informasi kamar, ketersediaan, fasilitas, dan status publikasinya."
        backHref={`/admin/kamar/${room.id}`}
      />
      <RoomForm
        room={room}
        branches={branches}
      />
    </div>
  );
}
