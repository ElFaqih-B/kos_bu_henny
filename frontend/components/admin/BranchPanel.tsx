import { MapPin, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type Branch = {
  id: number;
  name: string;
  totalRooms: number;
  availableRooms: number;
};

type Props = {
  branches: Branch[];
};

export default function BranchPanel({
  branches,
}: Props) {
  return (
    <article className="overflow-hidden rounded-xl border border-(--line) bg-white">
      <div className="flex min-h-17.5 items-center gap-3 border-b border-[#eeeae5] px-4 py-4 sm:px-4.5">
        <div>
          <h2 className="font-(family-name:--font-fraunces) text-lg tracking-tight">
            Cabang Kos
          </h2>
          <p className="mt-1 text-[11px] text-(--muted)">
            Informasi lokasi aktif.
          </p>
        </div>

        <button
          type="button"
          aria-label="Opsi cabang"
          className="ml-auto grid size-9 place-items-center rounded-lg text-(--ink) transition hover:bg-(--cream)"
        >
          <MoreHorizontal size={17} />
        </button>
      </div>

      <div className="grid px-3 pb-3">
        {branches.length > 0 ? (
          branches.map((branch) => (
            <div
              key={branch.id}
              className="flex min-h-17.5 items-center gap-2.5 border-b border-[#f0ece8] px-1.5 py-2.5 last:border-0"
            >
              <div className="grid size-9.5 shrink-0 place-items-center rounded-[9px] bg-(--cream) text-(--accent)">
                <MapPin size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <strong className="block truncate text-xs">
                  {branch.name}
                </strong>
                <span className="mt-1 block text-[10px] text-(--muted)">
                  {branch.totalRooms} kamar · {branch.availableRooms} tersedia
                </span>
              </div>

              <Link
                href={`/admin/cabang/${branch.id}`}
                className="
                  rounded-[9px] border border-(--line)
                  bg-white px-2.5 py-1.5 text-[10px]
                  font-bold text-(--accent) transition
                  hover:border-(--line-strong)
                "
              >
                Lihat
              </Link>
            </div>
          ))
        ) : (
          <div className="px-3 py-10 text-center">
            <p className="text-sm font-medium">
              Belum ada cabang.
            </p>
            <Link
              href="/admin/cabang"
              className="mt-2 inline-block text-xs font-semibold text-(--accent)"
            >
              Kelola cabang
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
