export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="h-18 bg-(--ink)">
        <div className="container-page flex h-full items-center justify-between">
          <div className="h-5 w-32 animate-pulse rounded bg-white/15" />

          <div className="hidden items-center gap-6 md:flex">
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-10 w-28 animate-pulse rounded-lg bg-white/15" />
          </div>

          <div className="size-10 animate-pulse rounded-lg bg-white/10 md:hidden" />
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative min-h-155 overflow-hidden bg-(--ink)">
          <div className="absolute inset-0 animate-pulse bg-white/5" />

          <div className="container-page relative flex min-h-135 items-center justify-center py-16">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
              <div className="h-5 w-36 animate-pulse rounded bg-white/10" />

              <div className="mt-5 h-12 w-[88%] max-w-2xl animate-pulse rounded-lg bg-white/14 sm:h-16" />

              <div className="mt-3 h-12 w-[70%] max-w-xl animate-pulse rounded-lg bg-white/10" />

              <div className="mt-6 h-4 w-[80%] max-w-lg animate-pulse rounded bg-white/10" />

              <div className="mt-2 h-4 w-[58%] max-w-sm animate-pulse rounded bg-white/10" />

              <div className="mt-8 flex gap-3">
                <div className="h-11 w-36 animate-pulse rounded-lg bg-white/18" />
                <div className="h-11 w-36 animate-pulse rounded-lg bg-white/10" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="container-page relative -mb-10">
            <div className="grid grid-cols-2 overflow-hidden rounded-[10px] border border-(--line) bg-white shadow-sm lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="min-h-24 border-(--line) p-4 even:border-l lg:border-l lg:first:border-l-0"
                >
                  <div className="h-3 w-20 animate-pulse rounded bg-black/8" />
                  <div className="mt-3 h-6 w-24 animate-pulse rounded bg-black/10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-white pb-16 pt-24 sm:pb-20 sm:pt-28">
          <div className="container-page">
            <SectionHeadingSkeleton />

            <div className="mt-8 grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="aspect-4/3 animate-pulse rounded-[10px] bg-black/6 lg:aspect-auto lg:min-h-120" />

              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square animate-pulse rounded-[10px] bg-black/6"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section className="bg-(--cream) py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeadingSkeleton />

            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(280px,360px)_1fr]">
              <div className="h-11 animate-pulse rounded-lg bg-white" />

              <div className="hidden justify-end gap-2 lg:flex">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-24 animate-pulse rounded-lg bg-white"
                  />
                ))}
              </div>
            </div>

            {/* Mobile */}
            <div className="mt-8 flex gap-3 overflow-hidden lg:hidden">
              {Array.from({ length: 2 }).map((_, index) => (
                <RoomCardSkeleton
                  key={index}
                  mobile
                />
              ))}
            </div>

            {/* Desktop */}
            <div className="mt-10 hidden grid-cols-3 gap-5 lg:grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <RoomCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="container-page">
            <SectionHeadingSkeleton />

            <div className="mt-7 hidden gap-2 lg:flex">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-28 animate-pulse rounded-lg bg-black/6"
                />
              ))}
            </div>

            <div className="mt-7 h-11 animate-pulse rounded-lg bg-black/5 lg:hidden" />

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:gap-5">
              <div className="min-h-80 animate-pulse rounded-[10px] bg-black/6 sm:min-h-100 lg:min-h-115" />

              <div className="min-h-80 animate-pulse rounded-[10px] bg-(--cream)" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-(--ink)">
        <div className="container-page">
          <div className="grid gap-10 py-12 lg:grid-cols-3">
            <div>
              <div className="h-6 w-36 animate-pulse rounded bg-white/12" />
              <div className="mt-4 h-3 w-64 max-w-full animate-pulse rounded bg-white/8" />
              <div className="mt-2 h-3 w-48 animate-pulse rounded bg-white/8" />
            </div>

            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />

                <div className="mt-5 grid gap-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/8" />
                  <div className="h-3 w-20 animate-pulse rounded bg-white/8" />
                  <div className="h-3 w-28 animate-pulse rounded bg-white/8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}


function SectionHeadingSkeleton() {
  return (
    <div className="max-w-xl">
      <div className="h-10 w-60 animate-pulse rounded-lg bg-black/8 sm:h-12" />
      <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded bg-black/6" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-black/6" />
    </div>
  );
}


function RoomCardSkeleton({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <div
      className={`
        shrink-0 overflow-hidden
        rounded-[10px]
        border border-(--line)
        bg-white
        ${
          mobile
            ? "aspect-square w-[84vw] max-w-80"
            : ""
        }
      `}
    >
      <div className="aspect-4/3 animate-pulse bg-black/6" />

      <div className="p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-black/8" />
        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-black/6" />

        <div className="mt-4 h-6 w-32 animate-pulse rounded bg-black/8" />

        <div className="mt-4 flex gap-2">
          <div className="h-3 w-16 animate-pulse rounded bg-black/6" />
          <div className="h-3 w-16 animate-pulse rounded bg-black/6" />
          <div className="h-3 w-12 animate-pulse rounded bg-black/6" />
        </div>

        <div className="mt-5 h-10 animate-pulse rounded-lg bg-black/7" />
      </div>
    </div>
  );
}