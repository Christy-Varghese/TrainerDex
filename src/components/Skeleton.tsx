// Shimmer placeholder blocks shown before async data arrives. CLAUDE.md requires
// a skeleton for every async surface — never a blank loading state.

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 dark:bg-white/10 ${className}`} />;
}

/** A card-shaped sprite tile skeleton (Pokédex / featured / raid grids). */
export function TileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-2.5 w-10" />
    </div>
  );
}

/** A horizontal list-row skeleton (events / news). */
export function RowSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function TileGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <TileSkeleton key={i} />
      ))}
    </div>
  );
}
