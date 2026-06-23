import Link from "next/link";
import { MemoriesGrid } from "@/components/memories/MemoriesGrid";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  getCachedMemoryPhotos,
  MEMORY_PAGE_SIZE,
} from "@/lib/queries/memories";
import { getTaskPhotoUrl } from "@/lib/blob";
import { getCachedCouple } from "@/lib/session";

type MemoriesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MemoriesPage({ searchParams }: MemoriesPageProps) {
  const { couple } = await getCachedCouple();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, total } = await getCachedMemoryPhotos(couple.id, page);
  const totalPages = Math.max(1, Math.ceil(total / MEMORY_PAGE_SIZE));

  return (
    <div className="stagger-children space-y-8">
      <PageHeader
        caption="Memories"
        title="Our moments"
        description="Photos from moments you've checked off together."
        illustration="memories"
      />

      {total === 0 ? (
        <EmptyState
          illustration="memories"
          title="No memories yet"
          description="Complete an entry with a photo to see it here."
          action={
            <Link href="/list" className={cn(buttonVariants())}>
              View list
            </Link>
          }
        />
      ) : (
        <>
          <MemoriesGrid
            items={items.map((task) => ({
              id: task.id,
              title: task.title,
              photoUrl: getTaskPhotoUrl(task.id),
              category: task.category,
            }))}
          />

          {totalPages > 1 ? (
            <nav
              aria-label="Memories pagination"
              className="flex items-center justify-center gap-4"
            >
              {page > 1 ? (
                <Link
                  href={page === 2 ? "/memories" : `/memories?page=${page - 1}`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Previous
                </Link>
              ) : (
                <span
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "pointer-events-none opacity-50",
                  )}
                >
                  Previous
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/memories?page=${page + 1}`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Next
                </Link>
              ) : (
                <span
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "pointer-events-none opacity-50",
                  )}
                >
                  Next
                </span>
              )}
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
