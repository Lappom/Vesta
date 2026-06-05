import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { getUserCouple } from "@/lib/couple";
import {
  getNotifications,
  getTasks,
  markNotificationsRead,
} from "@/lib/actions/task-actions";

export const dynamic = "force-dynamic";

export default async function TableauDeBordPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");

  const [tasks, notifications] = await Promise.all([
    getTasks(),
    getNotifications(),
  ]);

  const upcoming = tasks
    .filter((t) => t.status !== "done" && t.dueAt)
    .slice(0, 3);
  const recent = tasks.slice(0, 3);
  const unread = notifications.filter((n) => !n.read);

  return (
    <AppShell title="Tableau de bord">
      <div className="space-y-6">
        <section className="rounded-3xl bg-muted p-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue, {session.user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Votre espace à deux est prêt. {couple.members.length}/2 membres
            connectés.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/liste"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Voir la liste
            </Link>
            <Link
              href="/liste"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold"
            >
              Ajouter une idée
            </Link>
          </div>
        </section>

        {unread.length > 0 ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <form action={markNotificationsRead}>
                <Button type="submit" variant="ghost" size="sm">
                  Tout marquer lu
                </Button>
              </form>
            </div>
            <ul className="space-y-2">
              {unread.map((notification) => (
                <li
                  key={notification.id}
                  className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {upcoming.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">À venir</h2>
            <div className="space-y-3">
              {upcoming.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <p className="font-medium">{task.title}</p>
                  {task.dueAt ? (
                    <p className="text-sm text-muted-foreground">
                      {format(task.dueAt, "EEEE d MMMM à HH:mm", { locale: fr })}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Récent</h2>
          <div className="space-y-4">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Commencez par ajouter une sortie, une date ou un moment à vivre
                ensemble.
              </p>
            ) : (
              recent.map((task) => (
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
              ))
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
