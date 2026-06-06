import Image from "next/image";
import Link from "next/link";
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
import { getCategoryStyle } from "@/lib/design-tokens";

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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.map((task, index) => {
              const style = getCategoryStyle(task.category.slug);
              return (
                <article
                  key={task.id}
                  className="group overflow-hidden rounded-xl bg-surface-card [contain-intrinsic-size:300px] [content-visibility:auto]"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-soft">
                    <Image
                      src={getTaskPhotoUrl(task.id)}
                      alt={task.title}
                      fill
                      unoptimized
                      priority={index < 4}
                      placeholder="empty"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10"
                      style={
                        {
                          "--tw-gradient-from": `${style.bg}cc`,
                        } as React.CSSProperties
                      }
                    >
                      <p className="font-display text-sm text-white">
                        {task.title}
                      </p>
                      <p className="text-xs text-white/80">
                        {task.category.name}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

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
