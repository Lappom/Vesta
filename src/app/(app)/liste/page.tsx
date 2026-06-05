import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { TaskList } from "@/components/tasks/TaskList";
import { getUserCouple } from "@/lib/couple";
import { getCategories, getTasks } from "@/lib/actions/task-actions";

export const dynamic = "force-dynamic";

export default async function ListePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");

  const [tasks, categories] = await Promise.all([getTasks(), getCategories()]);

  return (
    <AppShell title="Liste">
      <TaskList tasks={tasks} categories={categories} />
    </AppShell>
  );
}
