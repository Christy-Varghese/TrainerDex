import Header from "@/components/Header";
import { Skeleton, TileGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <>
      <Header active="pokemon" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Skeleton className="mb-6 h-40 w-full rounded-3xl" />
        <Skeleton className="mb-3 h-11 w-full rounded-xl" />
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
        <TileGridSkeleton count={12} />
      </main>
    </>
  );
}
