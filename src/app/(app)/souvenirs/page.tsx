import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { getUserCouple } from "@/lib/couple";
import { getMemoryPhotos } from "@/lib/actions/task-actions";
import { getCategoryStyle } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function SouvenirsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");

  const memories = await getMemoryPhotos();

  return (
    <AppShell title="Souvenirs">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Photos des moments que vous avez cochés ensemble.
        </p>
        {memories.length === 0 ? (
          <div className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
            Aucun souvenir pour l&apos;instant. Terminez une entrée avec photo
            pour la voir ici.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {memories.map((task) => {
              const style = getCategoryStyle(task.category.slug);
              return (
                <article
                  key={task.id}
                  className="overflow-hidden rounded-2xl bg-card"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={task.photo!.blobUrl}
                      alt={task.title}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                  <div className="p-3">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: style.bg }}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.category.name}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
