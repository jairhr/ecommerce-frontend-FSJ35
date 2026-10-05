export default function CartLoading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-5 w-32 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </main>
  );
}