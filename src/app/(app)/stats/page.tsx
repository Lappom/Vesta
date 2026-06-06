import { VestaBrand } from "@/components/brand/VestaBrand";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { FeatureCard } from "@/components/ui/feature-card";
import { categoryStyles } from "@/lib/design-tokens";
import { getCoupleStats } from "@/lib/actions/task-actions";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const stats = await getCoupleStats();
  const maxCategory = Math.max(
    ...Object.values(categoryStyles).map((c) => stats.byCategory[c.slug] ?? 0),
    1
  );

  return (
    <div className="stagger-children space-y-8">
      <PageHeader
        caption={<VestaBrand size="sm" />}
        title="Your stats"
        description="An overview of your shared moments."
        illustration="stats"
      />

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
                    className="h-full rounded-full transition-all"
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
    </div>
  );
}
