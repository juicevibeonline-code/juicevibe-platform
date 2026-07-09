"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-bg p-8">
      <div className="text-center">
        <div className="text-8xl">😅</div>
        <h1 className="mt-6 font-heading text-4xl font-extrabold text-dark-green">
          Something went wrong!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Don&apos;t worry, our juices are still fresh. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
