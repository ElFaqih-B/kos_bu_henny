import Image from "next/image";
type HeroStat = {
  label: string;
  value: string;
};

type HeroProps = {
  imageUrl: string;
  headline: string;
  subheadline: string;

  primaryLabel: string;
  primaryHref: string;

  secondaryLabel?: string;
  secondaryHref?: string;

  stats?: HeroStat[];
};

export default function HeroSection({
  imageUrl,
  headline,
  subheadline,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  stats = [],
}: HeroProps) {
  return (
    <section id="beranda" className="bg-[--background]">
      {/* Hero Background */}
      <div className="relative min-h-155 overflow-hidden sm:min-h-170 lg:min-h-180">
        {/* Background Image */}
        {imageUrl && (
        <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
        />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black/60" />

        {/* Hero Content */}
        <div className="container-page relative z-10 flex min-h-155 items-center justify-center pb-24 pt-16 text-center sm:min-h-170 lg:min-h-180">
          <div className="mx-auto max-w-195">

            <h1 className="text-[clamp(2.8rem,10vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {headline}
            </h1>

            <p className="mx-auto mt-5 max-w-155 text-sm leading-6 text-white/90 sm:text-[17px]  sm:leading-7">
              {subheadline}
            </p>

            {/* CTA */}
            <div className="mx-auto mt-7 flex max-w-110 flex-col items-center gap-2.5 sm:max-w-none sm:flex-row sm:justify-center">

              <a
                href={primaryHref}
                className="flex min-h-12 w-[72%] items-center justify-center rounded-lg bg-(--accent) px-5 text-sm font-semibold text-white! hover:bg-(--accent-dark) sm:w-auto sm:px-6"
              >
                {primaryLabel}
              </a>

              {secondaryLabel && secondaryHref && (
                <a
                  href={secondaryHref}
                  className="flex min-h-12 w-[72%] items-center justify-center rounded-lg border border-white/40 bg-black/10 px-6 text-sm font-semibold text-white! hover:bg-white/10 sm:w-auto"
                >
                  {secondaryLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
        {stats.length > 0 && (
        <div className="container-page relative z-20 -mt-13 pb-14 sm:pb-16">
            <div className="grid grid-cols-2 overflow-hidden rounded-[10px] border border-(--line) bg-white shadow-[0_16px_40px_rgba(50,45,41,0.10)] md:grid-cols-4">
            {stats.map((stat, index) => (
                <div
                key={stat.label}
                className={`px-4 py-4 text-center sm:px-5 sm:py-5 ${
                    index % 2 === 0 ? "border-r border-(--line)" : ""
                } ${
                    index < 2 ? "border-b border-(--line) md:border-b-0" : ""
                } md:border-r md:border-(--line) md:last:border-r-0`}
                >
                <p className="font-(family-name:--font-fraunces) text-[11px] font-medium tracking-[0.04em] text-(--stone)">
                    {stat.label}
                </p>

                <p className="mt-1 font-(family-name:--font-fraunces) text-[18px] font-semibold tracking-[-0.02em] text-(--ink) sm:text-xl">
                    {stat.value}
                </p>
                </div>
            ))}
            </div>
        </div>
        )}
    </section>
  );
}