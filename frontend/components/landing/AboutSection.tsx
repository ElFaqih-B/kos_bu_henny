type AboutSectionProps = {
  name: string;
};

const timeline = [
  {
    year: "2019",
    title: "Cabang pertama berdiri",
    desc: "Kos Omah Subardiman mulai beroperasi, melayani penghuni dengan konsep hunian nyaman dan terjangkau.",
  },
  {
    year: "2022",
    title: "Cabang kedua dibangun",
    desc: "Seiring bertambahnya permintaan, cabang kedua hadir untuk menjangkau lebih banyak penghuni.",
  },
];

const highlights = [
  { label: "Tahun berdiri", value: "2019" },
  { label: "Jumlah cabang", value: "2" },
  { label: "Fokus utama", value: "Kenyamanan & keamanan" },
];

export default function AboutSection({ name }: AboutSectionProps) {
  return (
    <section id="tentang" className="bg-[--background] py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-(--ink)">
            Tentang Kos Omah Subardiman
          </h2>

          <p className="mt-6 text-sm leading-7 text-(--stone) sm:text-base sm:leading-8">
            {name} berdiri pada tahun 2019 dengan komitmen menghadirkan hunian
            yang nyaman, aman, dan mudah dijangkau. Seiring bertambahnya
            kepercayaan penghuni, cabang kedua dibangun pada tahun 2022 untuk
            melayani lebih banyak orang yang mencari tempat tinggal terbaik.
          </p>
        </div>

        {/* Stats + timeline in one compact row */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 border-t border-(--stone)/15 pt-10 lg:grid-cols-5">
          {/* Stats: narrow column */}
          <div className="grid grid-cols-3 gap-4 lg:col-span-2 lg:grid-cols-1 lg:gap-6 lg:border-r lg:border-(--stone)/15 lg:pr-8">
            {highlights.map((item) => (
              <div key={item.label} className="text-center lg:text-left">
                <div className="text-2xl font-semibold tracking-[-0.02em] text-(--ink) sm:text-3xl">
                  {item.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.08em] text-(--stone)">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline: side-by-side, not stacked */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3">
            {timeline.map((step) => (
              <div key={step.year}>
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-(--stone)">
                  {step.year}
                </div>
                <div className="mt-1 text-base font-semibold text-(--ink) sm:text-lg">
                  {step.title}
                </div>
                <p className="mt-1 text-sm leading-6 text-(--stone)">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}