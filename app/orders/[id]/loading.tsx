export default function OrderDetailLoading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

      <div className="mt-6 h-10 w-56 animate-pulse rounded bg-slate-200" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />

        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </main>
  );
}