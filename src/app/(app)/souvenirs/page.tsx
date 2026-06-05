import Image from "next/image";
import { MemoriesHero } from "@/components/illustrations/MemoriesHero";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMemoryPhotos } from "@/lib/actions/task-actions";
import { getCategoryStyle } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function SouvenirsPage() {
  const memories = await getMemoryPhotos();

  return (
    <div className="stagger-children space-y-8">
      <PageHeader
        caption="Souvenirs"
        title="Nos moments"
        description="Photos des moments que vous avez cochés ensemble."
        illustration={<MemoriesHero className="w-full" />}
      />

      {memories.length === 0 ? (
        <EmptyState
          illustration={<MemoriesHero className="w-full" />}
          title="Pas encore de souvenirs"
          description="Terminez une entrée avec photo pour la voir apparaître ici."
          action={
            <Button render={<Link href="/liste" />}>Voir la liste</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {memories.map((task) => {
            const style = getCategoryStyle(task.category.slug);
            return (
              <article
                key={task.id}
                className="group overflow-hidden rounded-xl bg-surface-card"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={task.photo!.blobUrl}
                    alt={task.title}
                    fill
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
                    <p className="text-xs text-white/80">{task.category.name}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
