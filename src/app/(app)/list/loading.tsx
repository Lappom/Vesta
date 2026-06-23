import { Skeleton } from "@/components/ui/skeleton";

export default function ListLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="hidden h-8 w-48 lg:block" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-24" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
}
