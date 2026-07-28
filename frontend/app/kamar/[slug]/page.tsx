import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomDetail from "@/components/room/RoomDetail";
import { serverGet } from "@/lib/server-api";
import type { Kamar, Pengaturan } from "@/lib/types";


type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};


async function getRoom(slug: string): Promise<Kamar | null> {
  try {
    return await serverGet<Kamar>(
      `kamar/${encodeURIComponent(slug)}`
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("404")
    ) {
      return null;
    }

    throw error;
  }
}


export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);

  if (!room) {
    return {
      title: "Kamar tidak ditemukan | Kos Bu Henny",
    };
  }

  const branchName =
    room.cabang?.nama ?? "Kos Bu Henny";

  return {
    title: `${room.nama} | Kos Bu Henny`,
    description:
      room.deskripsi ??
      `${room.nama} di ${branchName}. Lihat harga, fasilitas, dan ketersediaan kamar.`,
  };
}


export default async function RoomPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const [room, settings] = await Promise.all([
    getRoom(slug),
    serverGet<Pengaturan>("pengaturan"),
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