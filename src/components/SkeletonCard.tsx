export function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="h-32 bg-white/5" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 bg-white/5 rounded w-3/4" />
        <div className="h-2.5 bg-white/5 rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-2.5 bg-white/5 rounded w-12" />
          <div className="h-2.5 bg-white/5 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow({ count = 2 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-${count} gap-3`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
