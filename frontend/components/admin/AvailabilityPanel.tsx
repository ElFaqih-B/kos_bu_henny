import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type BranchAvailability = {
  name: string;
  available: number;
  total: number;
};

type Props = {
  branches: BranchAvailability[];
};

export default function AvailabilityPanel({
  branches,
}: Props) {
  const total = branches.reduce(
    (sum, branch) => sum + branch.total,
    0,
  );
  const available = branches.reduce(
    (sum, branch) => sum + branch.available,
    0,
  );
  const occupied = Math.max(
    total - available,
    0,
  );

  return (
    <article className="overflow-hidden rounded-xl border border-(--line) bg-white">
      <PanelHeader />

      {branches.length > 0 ? (
        <>
          <div className="grid gap-5 px-4 pb-2 pt-5 sm:px-4.5">
            {branches.map((branch) => (
              <AvailabilityRow
                key={branch.name}
                branch={branch}
              />
            ))}
          </div>

          <div className="mx-4 mt-4 grid grid-cols-3 border-t border-(--line) py-4 sm:mx-4.5">
            <SummaryStat
              label="Total"
              value={total}
            />
            <SummaryStat
              label="Tersedia"
              value={available}
            />
            <SummaryStat
              label="Terisi"
              value={occupied}
            />
          </div>
        </>
      ) : (
        <div className="px-4 py-10 text-center">
          <p className="text-sm font-medium">
            Data cabang belum tersedia.
          </p>
          <p className="mt-1 text-xs text-(--muted)">
            Tambahkan cabang untuk melihat ketersediaan.
          </p>
        </div>
      )}
    </article>
  );
}

function PanelHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-[#eeeae5] px-4 py-4 sm:px-4.5">
      <div className="min-w-0">
        <h2 className="font-(family-name:--font-fraunces) text-lg">
          Ringkasan Ketersediaan
        </h2>
        <p className="mt-1 text-[11px] text-(--muted)">
          Perbandingan kamar tersedia di setiap cabang.
        </p>
      </div>

      <Link
        href="/admin/kamar"
        className="
        ml-auto inline-flex shrink-0 items-center gap-1
        rounded-lg px-2 py-2 text-[10px] font-bold
        text-(--accent) transition hover:bg-(--cream)
      "
      >
        <span className="hidden sm:inline">
          Kelola kamar
        </span>
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

function AvailabilityRow({
  branch,
}: {
  branch: BranchAvailability;
}) {
  const percentage = branch.total
    ? Math.round(
        (branch.available / branch.total) * 100,
      )
    : 0;

  return (
    <div className="grid gap-2">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <strong className="block truncate text-xs sm:text-[13px]">
            {branch.name}
          </strong>
          <span className="mt-1 block text-[10px] text-(--muted)">
            {branch.available} dari {branch.total} kamar tersedia
          </span>
        </div>

        <b className="font-(family-name:--font-fraunces) text-sm sm:text-base">
          {percentage}%
        </b>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#eeeae5]">
        <span
          className="block h-full rounded-full bg-(--accent)"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="grid gap-1 border-l border-(--line) px-3 first:border-l-0 first:pl-0">
      <span className="text-[9px] text-(--muted)">
        {label}
      </span>
      <strong className="font-(family-name:--font-fraunces) text-lg sm:text-xl">
        {value}
      </strong>
    </div>
  );
}
