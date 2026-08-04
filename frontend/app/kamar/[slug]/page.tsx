import {
  notFound,
} from "next/navigation";

import RoomDetail from "@/components/room/RoomDetail";
import {
  serverGet,
} from "@/lib/server-api";
import type {
  Kamar,
  Pengaturan,
} from "@/lib/types";


type RoomDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function RoomDetailPage({
  params,
}: RoomDetailPageProps) {
  const { slug } = await params;

  const [
    room,
    settings,
  ] = await Promise.all([
    serverGet<Kamar>(
      `kamar/${encodeURIComponent(slug)}`,
    ).catch(() => null),

    serverGet<Pengaturan>(
      "pengaturan",
    ),
  ]);

  if (!room) {
    notFound();
  }

  return (
    <RoomDetail
      room={room}
      settings={settings}
    />
  );
}