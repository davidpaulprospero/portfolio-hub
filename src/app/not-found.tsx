import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted">
        That page doesn&apos;t exist. The projects are all on the home page.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-accent hover:underline"
      >
        ← Back to the portfolio
      </Link>
    </main>
  );
}