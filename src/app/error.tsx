"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-1 flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
        <Icon name="info" className="text-2xl" />
      </span>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        That page hit a snag. Try again, or head back to your dashboard.
      </p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
