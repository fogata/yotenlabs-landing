export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-[var(--foreground)]">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-8 backdrop-blur-2xl">
        <p className="font-mono text-xs uppercase text-[var(--primary)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Page not found
        </h1>
      </div>
    </main>
  );
}
