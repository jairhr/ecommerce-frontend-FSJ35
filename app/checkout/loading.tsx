export default function CheckoutLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <div className="h-9 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-5 w-72 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />

        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </main>
  );
}