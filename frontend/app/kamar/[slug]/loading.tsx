export default function LoadingRoomDetail() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-18 border-b border-black/8 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-black/8" />

          <div className="h-10 w-24 animate-pulse rounded-lg bg-black/6" />
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Left */}
          <div>
            <div className="aspect-4/3 animate-pulse rounded-[10px] bg-black/6 md:aspect-5/4" />

            <div className="mt-8 border-t border-black/8 pt-7">
              <div className="h-7 w-40 animate-pulse rounded bg-black/8" />

              <div className="mt-4 h-4 w-full animate-pulse rounded bg-black/6" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-black/6" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-black/6" />
            </div>

            <div className="mt-8 border-t border-black/8 pt-7">
              <div className="h-7 w-32 animate-pulse rounded bg-black/8" />

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 animate-pulse rounded-lg bg-black/5"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <aside>
            <div className="rounded-[10px] border border-black/8 p-5 sm:p-6 md:p-7">
              <div className="h-4 w-28 animate-pulse rounded bg-black/6" />

              <div className="mt-5 h-10 w-3/4 animate-pulse rounded-lg bg-black/8" />

              <div className="mt-7 h-20 animate-pulse rounded-lg bg-(--cream)" />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="h-20 animate-pulse rounded-lg bg-black/5" />
                <div className="h-20 animate-pulse rounded-lg bg-black/5" />
              </div>

              <div className="mt-3 h-20 animate-pulse rounded-lg bg-black/5" />

              <div className="mt-5 h-12 animate-pulse rounded-lg bg-(--accent)/20" />

              <div className="mt-6 border-t border-black/8 pt-6">
                <div className="h-4 w-24 animate-pulse rounded bg-black/6" />
                <div className="mt-4 h-4 w-40 animate-pulse rounded bg-black/8" />
                <div className="mt-2 h-3 w-full animate-pulse rounded bg-black/6" />
                <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-black/6" />
              </div>
            </div>

            <div className="mt-4 h-20 animate-pulse rounded-[10px] bg-(--cream)" />
          </aside>
        </div>
      </div>
    </main>
  );
}