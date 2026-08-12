import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone: "cream" | "sage" | "blue" | "rose";
};

const toneClasses = {
  cream: "bg-[#f8eee2]",
  sage: "bg-[#edf3e6]",
  blue: "bg-[#e9f0f1]",
  rose: "bg-[#f4e9e8]",
};

export default function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: Props) {
  return (
    <article
      className={[
        "min-w-0 rounded-xl border border-(--ink)/5 p-3.5",
        "sm:min-h-[136px] sm:p-4.5",
        toneClasses[tone],
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2 text-[10px] font-semibold text-(--ink-soft) sm:text-[11px]">
        <span className="leading-4">
          {label}
        </span>

        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/55">
          <Icon size={15} />
        </span>
      </div>

      <strong className="mt-3 block font-(family-name:--font-fraunces) text-[24px] leading-none tracking-[-0.03em] sm:text-[27px]">
        {value}
      </strong>

      <p className="mt-2 text-[10px] leading-4 text-(--ink)/55 sm:text-[11px]">
        {description}
      </p>
    </article>
  );
}
