type AboutSectionProps = {
  name: string;
};

const timeline = [
  {
    year: "2019",
    title: "Cabang pertama berdiri",
    desc: "Kos Omah Subardiman mulai beroperasi dengan konsep hunian yang nyaman dan terjangkau.",
  },
  {
    year: "2022",
    title: "Cabang kedua dibangun",
    desc: "Seiring bertambahnya permintaan, cabang kedua hadir untuk melayani lebih banyak penghuni.",
  },
];

const highlights = [
  {
    label: "Tahun berdiri",
    value: "2019",
  },
  {
    label: "Jumlah cabang",
    value: "2",
  },
  {
    label: "Fokus utama",
    value: "Kenyamanan & keamanan",
  },
];

export default function AboutSection({ name }: AboutSectionProps) {
  return (
    <section
      id="tentang"
      aria-labelledby="about-heading"
      className="bg-(--background) py-14 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="about-heading"
            className="text-[clamp(2rem,8vw,3.75rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-(--ink)"
          >
            Tentang {name}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-(--stone) sm:mt-6 sm:text-base sm:leading-8">
            {name} berdiri pada tahun 2019 dengan komitmen menghadirkan
            hunian yang nyaman, aman, dan mudah dijangkau. Seiring
            bertambahnya kepercayaan penghuni, cabang kedua dibangun pada
            tahun 2022 untuk melayani lebih banyak orang yang mencari tempat
            tinggal terbaik.
          </p>
        </div>

        {/* Main content */}
        <div className="mx-auto mt-10 max-w-6xl border-t border-(--stone)/15 pt-8 sm:mt-12 sm:pt-10 lg:mt-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.8fr)] lg:gap-12">
            {/* Highlights */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-1 lg:content-start lg:border-r lg:border-(--stone)/15 lg:pr-10">
              {highlights.map((item, index) => (
                <div
                  key={item.label}
                  className={
                    index === highlights.length - 1
                      ? "col-span-2 border-t border-(--stone)/10 pt-5 text-center sm:col-span-1 sm:border-t-0 sm:pt-0 lg:col-span-1 lg:text-left"
                      : "text-center lg:text-left"
                  }
                >
                  <dd className="wrap-break-word text-xl leading-tight font-semibold tracking-[-0.02em] text-(--ink) sm:text-2xl lg:text-3xl">
                    {item.value}
                  </dd>

                  <dt className="mt-2 text-[0.7rem] leading-5 font-medium tracking-[0.08em] text-(--stone) uppercase sm:text-xs">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Timeline */}
            <ol className="relative space-y-7 border-l border-(--stone)/20 pl-6 sm:space-y-0 sm:border-l-0 sm:pl-0 md:grid md:grid-cols-2 md:gap-8">
              {timeline.map((step) => (
                <li
                  key={step.year}
                  className="relative md:border-t md:border-(--stone)/20 md:pt-6"
                >
                  {/* Mobile timeline dot */}
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 left-[-1.78rem] size-3 rounded-full border-2 border-(--background) bg-(--ink) md:top-[-0.4rem] md:left-0"
                  />

                  <time className="block text-xs font-semibold tracking-widest text-(--stone) uppercase">
                    {step.year}
                  </time>

                  <h3 className="mt-2 text-lg leading-snug font-semibold tracking-[-0.015em] text-(--ink) sm:text-xl">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-7 text-(--stone) sm:text-base">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}