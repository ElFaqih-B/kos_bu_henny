type AboutSectionProps = {
  name: string;
};


export default function AboutSection({
  name,
}: AboutSectionProps) {
  return (
    <section
      id="tentang"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-(--ink)">
            Hunian nyaman dengan fasilitas yang lengkap.
          </h2>

          <p className="mt-6 text-sm leading-7 text-(--stone) sm:text-base sm:leading-8">
            {name} berdiri pada tahun 2019, dan cabang kedua dibangun pada tahun 2022...
          </p>
        </div>
      </div>
    </section>
  );
}