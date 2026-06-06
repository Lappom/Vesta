import { TaskList } from "@/components/tasks/TaskList";
import { getCategories } from "@/lib/actions/task-actions";
import { queryCoupleTasks } from "@/lib/queries/tasks";
import { getCachedCouple } from "@/lib/session";

export default async function ListePage() {
  const [{ couple }, categories] = await Promise.all([
    getCachedCouple(),
    getCategories(),
  ]);

  const tasks = await queryCoupleTasks(couple.id);

  return <TaskList tasks={tasks} categories={categories} />;
}
