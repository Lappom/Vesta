import Link from "next/link";
import { auth } from "@/auth";
import { VestaBrand } from "@/components/brand/VestaBrand";
import { DashboardHero } from "@/components/illustrations/DashboardHero";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroBand } from "@/components/ui/hero-band";
import { StatCard } from "@/components/ui/stat-card";
import { FeatureCard } from "@/components/ui/feature-card";
import { Badge } from "@/components/ui/badge";
import { getUserCouple } from "@/lib/couple";
import {
  getCoupleStats,
  getNotifications,
  getTasks,
  markNotificationsRead,
} from "@/lib/actions/task-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const couple = await getUserCouple(session!.user!.id);

  const [tasks, notifications, stats] = await Promise.all([
    getTasks(),
    getNotifications(),
    getCoupleStats(),
  ]);

  const upcoming = tasks
    .filter((t) => t.status !== "done" && t.dueAt)
    .slice(0, 3);
  const recent = tasks.slice(0, 3);
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="stagger-children space-y-8">
      <HeroBand illustration={<DashboardHero className="w-full" />}>
        <VestaBrand size="sm" />
        <h1 className="mt-2 text-display-md text-ink">
          Welcome, {session!.user!.name}
        </h1>
        <p className="mt-3 max-w-prose text-sm text-body">
          Your space for two is ready. {couple!.members.length}/2 members
          connected.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/list" className={cn(buttonVariants())}>
            View list
          </Link>
          <Link
            href="/list"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Add an idea
          </Link>
        </div>
      </HeroBand>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          variant="teal"
          label="Upcoming"
          value={upcoming.length}
          detail="scheduled entries"
        />
        <StatCard
          variant="peach"
          label="This month"
          value={stats.doneThisMonth}
          detail="moments shared"
        />
      </div>

      {unread.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-display-sm text-ink">
              Notifications
            </h2>
            <form action={markNotificationsRead}>
              <Button type="submit" variant="ghost" size="sm">
                Mark all read
              </Button>
            </form>
          </div>
          <ul className="space-y-2">
            {unread.map((notification) => (
              <li key={notification.id}>
                <FeatureCard variant="cream" className="!p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="pill">New</Badge>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                </FeatureCard>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-display-sm text-ink">Upcoming</h2>
          <div className="space-y-4">
            {upcoming.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                categorySlug={task.category.slug}
                categoryName={task.category.name}
                status={task.status}
                assignee={task.assignee}
                dueAt={task.dueAt}
                photoUrl={task.photo?.blobUrl}
                locationLabel={task.location?.label}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-display-sm text-ink">Recent</h2>
        {recent.length === 0 ? (
          <FeatureCard variant="cream">
            <p className="text-sm text-muted-foreground">
              Start by adding an outing, a date, or a moment to share together.
            </p>
          </FeatureCard>
        ) : (
          <div className="space-y-4">
            {recent.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                categorySlug={task.category.slug}
                categoryName={task.category.name}
                status={task.status}
                assignee={task.assignee}
                dueAt={task.dueAt}
                photoUrl={task.photo?.blobUrl}
                locationLabel={task.location?.label}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
