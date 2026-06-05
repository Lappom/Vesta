import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { getUserCouple } from "@/lib/couple";
import { getCoupleStats } from "@/lib/actions/task-actions";
import { categoryStyles } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");

  const stats = await getCoupleStats();

  return (
    <AppShell title="Stats">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-muted p-5">
            <p className="text-sm text-muted-foreground">Ce mois-ci</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stats.doneThisMonth}
            </p>
            <p className="text-sm">entrées terminées</p>
          </div>
          <div className="rounded-3xl bg-muted p-5">
            <p className="text-sm text-muted-foreground">Taux de complétion</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stats.completionRate}%
            </p>
            <p className="text-sm">
              {stats.doneCount}/{stats.total} au total
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Par catégorie</h2>
          <div className="space-y-3">
            {Object.values(categoryStyles).map((category) => (
              <div
                key={category.slug}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: category.bg }}
                  />
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {stats.byCategory[category.slug] ?? 0}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
