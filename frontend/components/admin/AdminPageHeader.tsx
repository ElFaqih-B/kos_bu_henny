import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  action?: ReactNode;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Kembali",
  action,
}: Props) {
  return (
    <header className="mb-5 sm:mb-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="
                mb-3 inline-flex min-h-8 items-center gap-1.5
                text-xs font-semibold text-(--stone) transition
                hover:text-(--accent)
              "
            >
              <ArrowLeft size={14} />
              {backLabel}
            </Link>
          )}

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--accent)">
            {eyebrow}
          </p>

          <h1 className="
            mt-1.5 font-(family-name:--font-fraunces)
            text-[clamp(2rem,7vw,2.8rem)] font-semibold
            leading-none tracking-[-0.04em]
          ">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-5.5 text-(--stone) sm:text-sm sm:leading-6">
            {description}
          </p>
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
