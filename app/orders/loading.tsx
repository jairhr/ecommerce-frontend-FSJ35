export default function OrdersLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-5 w-72 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>
    </main>
  );
}