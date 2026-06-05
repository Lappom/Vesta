import { Button } from "@/components/ui/button";
import { getCategoryStyle } from "@/lib/design-tokens";
import { TaskListRow } from "@/components/tasks/TaskListRow";

type TaskListMobileItemProps = {
  task: {
    id: string;
    title: string;
    status: "todo" | "in_progress" | "done";
    dueAt: Date | null;
    category: { slug: string };
  };
  actionPending: boolean;
  onEdit: () => void;
  onMarkDone: () => void;
  onMarkInProgress: () => void;
  onDelete: () => void;
};

export function TaskListMobileItem({
  task,
  actionPending,
  onEdit,
  onMarkDone,
  onMarkInProgress,
  onDelete,
}: TaskListMobileItemProps) {
  const style = getCategoryStyle(task.category.slug);

  return (
    <div className="min-w-0">
      <TaskListRow
        title={task.title}
        categorySlug={task.category.slug}
        status={task.status}
        dueAt={task.dueAt}
        onClick={onEdit}
      />
      <div
        className="flex flex-wrap gap-2 border-t border-white/15 px-3 py-2"
        style={{ backgroundColor: style.bg, color: style.text }}
        onClick={(e) => e.stopPropagation()}
      >
        {task.status !== "done" ? (
          <Button
            type="button"
            variant="on-color"
            size="sm"
            disabled={actionPending}
            onClick={onMarkDone}
          >
            Mark done
          </Button>
        ) : null}
        {task.status === "todo" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={actionPending}
            className="border-white/30 bg-white/10 text-inherit hover:bg-white/20"
            onClick={onMarkInProgress}
          >
            In progress
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={actionPending}
          className="text-inherit hover:bg-white/15"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
