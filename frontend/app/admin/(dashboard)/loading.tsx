export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse">
      <div className="h-3 w-24 rounded bg-(--line)" />
      <div className="mt-3 h-10 w-48 rounded bg-(--line)" />
      <div className="mt-3 h-5 w-full max-w-xl rounded bg-(--line)" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-[10px] border border-(--line) bg-white"
          />
        ))}
      </div>
    </div>
  );
}
