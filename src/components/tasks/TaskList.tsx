"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListHero } from "@/components/illustrations/ListHero";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskListMobileItem } from "@/components/tasks/TaskListMobileItem";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/ui/category-tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TaskForm } from "@/components/tasks/TaskForm";
import { updateTaskStatus, deleteTask } from "@/lib/actions/task-actions";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  assignee: "me" | "partner" | "both";
  dueAt: Date | null;
  category: { id: string; name: string; slug: string };
  photo: { blobUrl: string } | null;
  location: { lat: number; lng: number; label: string | null } | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type TaskListProps = {
  tasks: Task[];
  categories: Category[];
};

const filters = [
  { id: "all", label: "All" },
  { id: "sortie", label: "Outings" },
  { id: "date", label: "Dates" },
  { id: "pratique", label: "Practical" },
  { id: "intimite", label: "Intimacy" },
];

const statusFilters = [
  { id: "all", label: "All statuses" },
  { id: "todo", label: "To do" },
  { id: "in_progress", label: "In progress" },
  { id: "done", label: "Done" },
];

export function TaskList({ tasks, categories }: TaskListProps) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [actionPending, startAction] = useTransition();

  useEffect(() => {
    const refresh = () => router.refresh();

    const interval = window.setInterval(refresh, 15_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  const runAction = (action: () => Promise<void>) => {
    startAction(async () => {
      await action();
      router.refresh();
    });
  };

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (categoryFilter !== "all" && task.category.slug !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, categoryFilter, statusFilter]);

  return (
    <div className="stagger-children space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          caption="List"
          title="Our list"
          description="Outings, dates, and moments to share together."
          illustration={<ListHero className="w-full" />}
        />
        <Sheet open={addOpen} onOpenChange={setAddOpen}>
          <SheetTrigger
            render={<Button className="shrink-0" />}
          >
            <span className="lg:hidden">Add</span>
            <span className="hidden lg:inline">Add an entry</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[90dvh] overflow-y-auto sm:max-w-lg sm:mx-auto"
          >
            <SheetHeader>
              <SheetTitle className="font-display text-display-sm">
                New entry
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <TaskForm
                categories={categories}
                sheetOpen={addOpen}
                onSuccess={() => {
                  setAddOpen(false);
                  router.refresh();
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <CategoryTabs
        items={filters}
        value={categoryFilter}
        onChange={setCategoryFilter}
        aria-label="Filter by category"
      />

      <CategoryTabs
        items={statusFilters}
        value={statusFilter}
        onChange={setStatusFilter}
        aria-label="Filter by status"
      />

      {filtered.length === 0 ? (
        <EmptyState
          illustration={<ListHero className="w-full" />}
          title="Empty list"
          description="Add your first idea for two."
          action={
            <Button onClick={() => setAddOpen(true)}>Add an entry</Button>
          }
        />
      ) : (
        <>
          <div className="min-w-0 lg:hidden">
            <div
              role="table"
              aria-label="List entries"
              className="w-full min-w-0 overflow-hidden rounded-xl border border-hairline/80"
            >
              <div role="rowgroup">
                <div
                  role="row"
                  className="grid grid-cols-[minmax(0,1fr)_5.75rem_3.75rem] gap-x-2 border-b border-hairline/80 bg-surface-card/70 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  <div role="columnheader" className="min-w-0 truncate">
                    Entry
                  </div>
                  <div role="columnheader" className="min-w-0 truncate text-right">
                    Status
                  </div>
                  <div role="columnheader" className="min-w-0 truncate text-right">
                    Date
                  </div>
                </div>
              </div>
              <div role="rowgroup" className="divide-y divide-hairline/30">
                {filtered.map((task) => (
                  <TaskListMobileItem
                    key={task.id}
                    task={task}
                    actionPending={actionPending}
                    onEdit={() => setEditingTask(task)}
                    onMarkDone={() =>
                      runAction(() => updateTaskStatus(task.id, "done"))
                    }
                    onMarkInProgress={() =>
                      runAction(() => updateTaskStatus(task.id, "in_progress"))
                    }
                    onDelete={() => runAction(() => deleteTask(task.id))}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hidden space-y-4 lg:block">
            {filtered.map((task) => (
              <div key={task.id} className="space-y-2">
                <TaskCard
                  title={task.title}
                  description={task.description}
                  categorySlug={task.category.slug}
                  categoryName={task.category.name}
                  status={task.status}
                  assignee={task.assignee}
                  dueAt={task.dueAt}
                  photoUrl={task.photo?.blobUrl}
                  locationLabel={task.location?.label}
                  onClick={() => setEditingTask(task)}
                />
                <div className="flex flex-wrap gap-2 px-1">
                  {task.status !== "done" ? (
                    <Button
                      type="button"
                      variant="on-color"
                      size="sm"
                      disabled={actionPending}
                      onClick={() =>
                        runAction(() => updateTaskStatus(task.id, "done"))
                      }
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
                      onClick={() =>
                        runAction(() =>
                          updateTaskStatus(task.id, "in_progress"),
                        )
                      }
                    >
                      In progress
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={actionPending}
                    onClick={() => runAction(() => deleteTask(task.id))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Sheet
        open={editingTask !== null}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <SheetContent
          side="bottom"
          className="max-h-[90dvh] overflow-y-auto sm:max-w-lg sm:mx-auto"
        >
          <SheetHeader>
            <SheetTitle className="font-display text-display-sm">
              Edit entry
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            {editingTask ? (
              <TaskForm
                key={editingTask.id}
                categories={categories}
                sheetOpen={editingTask !== null}
                task={{
                  id: editingTask.id,
                  title: editingTask.title,
                  description: editingTask.description,
                  categoryId: editingTask.category.id,
                  assignee: editingTask.assignee,
                  dueAt: editingTask.dueAt,
                  location: editingTask.location,
                  photoUrl: editingTask.photo?.blobUrl,
                }}
                onSuccess={() => {
                  setEditingTask(null);
                  router.refresh();
                }}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
