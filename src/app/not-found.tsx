export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-[var(--foreground)]">
      <div className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-zinc-500">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">
          Page not found
        </h1>
      </div>
    </main>
  );
}
