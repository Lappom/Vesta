import { TaskList } from "@/components/tasks/TaskList";
import { getCategories, getTasks } from "@/lib/actions/task-actions";

export const dynamic = "force-dynamic";

export default async function ListePage() {
  const [tasks, categories] = await Promise.all([getTasks(), getCategories()]);

  return <TaskList tasks={tasks} categories={categories} />;
}
