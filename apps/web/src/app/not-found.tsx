import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-bg p-8">
      <div className="text-center">
        <div className="text-8xl">🧃</div>
        <h1 className="mt-6 font-heading text-4xl font-extrabold text-dark-green">404</h1>
        <p className="mt-4 text-lg text-gray-600">
          Oops! This page seems to have been juiced away.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
