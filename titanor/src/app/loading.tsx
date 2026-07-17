export default function Loading() {
  return (
    <section className="py-12">
      <div className="container-shell">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-lg border border-white/10 bg-white/5" />
          ))}
        </div>
      </div>
    </section>
  );
}
