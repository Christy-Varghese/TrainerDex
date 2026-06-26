import Header from "@/components/Header";
import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <Header active="raids" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Skeleton className="mb-6 h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </main>
    </>
  );
}
