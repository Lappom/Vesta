import { Skeleton } from "@/components/ui/skeleton";

export default function MemoriesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="hidden h-8 w-40 lg:block" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="size-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}
