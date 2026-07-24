import {
  ArrowDownRight,
  MessageCircle,
} from "lucide-react";

type HeroSectionProps = {
  headline: string;
  subheadline: string;
  heroImageUrl?: string | null;

  primaryCtaText: string;
  secondaryCtaText: string;

  whatsappUrl?: string | null;

  startingPrice: string;
  roomTypes: number;
  availableRooms: number;
  branches: number;
};

export default function HeroSection({
  headline,
  subheadline,
  heroImageUrl,

  primaryCtaText,
  secondaryCtaText,

  whatsappUrl,

  startingPrice,
  roomTypes,
  availableRooms,
  branches,
}: HeroSectionProps) {
  const facts = [
    {
      label: "Harga mulai",
      value: startingPrice,
    },
    {
      label: "Pilihan kamar",
      value: `${roomTypes} tipe`,
    },
    {
      label: "Kamar tersedia",
      value: `${availableRooms} kamar`,
    },
    {
      label: "Lokasi",
      value: `${branches} cabang`,
    },
  ];

  return (
    <section
      id="beranda"
      className="
        relative
        mb-24
        min-h-[520px]
        overflow-visible
        bg-(--ink)
        text-(--cream)

        sm:min-h-[560px]
        md:min-h-[610px]
        lg:min-h-[640px]
      "
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            brightness-50
            saturate-(0.9)
          "
          style={
            heroImageUrl
              ? {
                  backgroundImage: `url("${heroImageUrl}")`,
                }
              : undefined
          }
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(
              180deg,
              rgba(18,15,13,.30)_0%,
              rgba(18,15,13,.48)_46%,
              rgba(18,15,13,.84)_100%
            )]
          "
        />
      </div>

      {/* Hero content */}
      <div
        className="
          container-page
          relative
          z-10

          flex
          min-h-130
          items-center
          justify-center

          pb-28
          pt-2

          sm:min-h-[560px]
          sm:pb-28

          md:min-h-[610px]
          md:pb-32

          lg:min-h-[640px]
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[880px]

            -translate-y-4
            text-center

            md:-translate-y-6
          "
        >
          <h1
            className="
              mx-auto
              max-w-[860px]

              text-balance
              text-[clamp(2.35rem,6vw,4.6rem)]
              leading-[1.02]
              tracking-[-0.03em]

              text-(--cream)
            "
          >
            {headline}
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-[610px]

              px-1

              text-[14px]
              leading-6
              text-white/85

              sm:text-[15px]
              sm:leading-7

              md:mt-5
              md:text-base
            "
          >
            {subheadline}
          </p>

          {/* CTA */}
          <div
            className="
              mx-auto
              mt-6

              flex
              max-w-full
              flex-wrap
              items-center
              justify-center

              gap-2.5

              sm:mt-7
              sm:gap-3
            "
          >
            <a
              href="#kamar"
              className="
                inline-flex
                min-h-11
                min-w-[154px]
                items-center
                justify-center
                gap-2

                rounded-lg
                bg-(--gold)

                px-4
                py-2.5

                text-[13px]
                font-semibold
                text-(--ink)

                transition-colors
                hover:bg-(--gold-light)

                sm:min-h-12
                sm:min-w-[174px]
                sm:px-5
                sm:text-sm
              "
            >
              <span className="whitespace-nowrap">
                {primaryCtaText}
              </span>

              <ArrowDownRight
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>

            <a
              href={whatsappUrl ?? "#"}
              target={whatsappUrl ? "_blank" : undefined}
              rel={whatsappUrl ? "noreferrer" : undefined}
              aria-disabled={!whatsappUrl}
              className="
                inline-flex
                min-h-11
                min-w-[154px]
                items-center
                justify-center
                gap-2

                rounded-lg
                border
                border-white/30
                bg-black/15

                px-4
                py-2.5

                text-[13px]
                font-semibold
                text-(--cream)

                transition-colors
                hover:border-white/50
                hover:bg-white/10

                sm:min-h-12
                sm:min-w-[174px]
                sm:px-5
                sm:text-sm
              "
            >
              <MessageCircle
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span className="whitespace-nowrap">
                {secondaryCtaText}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Information bar */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-20
          translate-y-1/2
        "
      >
        <div className="container-page">
          <div
            className="
              grid
              grid-cols-2

              overflow-hidden

              rounded-[10px]
              border
              border-black/8

              bg-white

              shadow-[0_18px_50px_rgba(28,24,21,.18)]

              lg:grid-cols-4
            "
          >
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`
                  min-w-0
                  px-3.5
                  py-3.5

                  sm:px-5
                  sm:py-4

                  md:px-6
                  md:py-5

                  ${
                    index % 2 !== 0
                      ? "border-l border-(--line)"
                      : ""
                  }

                  ${
                    index > 1
                      ? "border-t border-(--line) lg:border-t-0"
                      : ""
                  }

                  ${
                    index > 0
                      ? "lg:border-l lg:border-(--line)"
                      : ""
                  }
                `}
              >
                <span
                  className="
                    block
                    text-[10px]
                    font-medium
                    leading-tight
                    text-(--stone)

                    sm:text-[11px]
                  "
                >
                  {fact.label}
                </span>

                <strong
                  className="
                    mt-1
                    block
                    truncate

                    font-(family-name:--font-fraunces)

                    text-[17px]
                    leading-tight
                    text-(--ink)

                    sm:text-[20px]
                    md:text-[23px]
                  "
                >
                  {fact.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}