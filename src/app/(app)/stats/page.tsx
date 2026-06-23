import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { categoryStyles } from "@/lib/design-tokens";
import { getCoupleStats } from "@/lib/actions/task-actions";


export default async function StatsPage() {
  const stats = await getCoupleStats();
  const maxCategory = Math.max(
    ...Object.values(categoryStyles).map((c) => stats.byCategory[c.slug] ?? 0),
    1
  );

  return (
    <div className="stagger-children space-y-8">
      <PageHeader
        caption="Stats"
        title="Your stats"
        description="An overview of your shared moments."
        illustration="stats"
      />

      {stats.total === 0 ? (
        <EmptyState
          illustration="stats"
          title="No stats yet"
          description="Complete your first entry together to start tracking your moments."
          action={
            <Link href="/list?add=1" className={cn(buttonVariants())}>
              Add an entry
            </Link>
          }
        />
      ) : (
        <>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          variant="pink"
          label="This month"
          value={stats.doneThisMonth}
          detail="entries completed"
        />
        <StatCard
          variant="teal"
          label="Completion rate"
          value={`${stats.completionRate}%`}
          detail={`${stats.doneCount}/${stats.total} total`}
        />
      </div>

      <FeatureCard variant="cream">
        <h2 className="mb-5 font-display text-display-sm text-ink">
          By category
        </h2>
        <div className="space-y-4">
          {Object.values(categoryStyles).map((category) => {
            const count = stats.byCategory[category.slug] ?? 0;
            const width = Math.round((count / maxCategory) * 100);
            return (
              <div key={category.slug} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{category.label}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-hairline-soft">
                  <div
                    className="h-full rounded-full transition-[width] duration-200 ease-out"
                    style={{
                      width: `${width}%`,
                      backgroundColor: category.bg,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </FeatureCard>
        </>
      )}
    </div>
  );
}
