import Header from "@/components/Header";
import { Skeleton, RowSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <Header active="events" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Skeleton className="mb-6 h-40 w-full rounded-3xl" />
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      </main>
    </>
  );
}
