"use client";

import { useMemo, useState, useTransition } from "react";
import { ListHero } from "@/components/illustrations/ListHero";
import { TaskCard } from "@/components/tasks/TaskCard";
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
  category: { name: string; slug: string };
  photo: { blobUrl: string } | null;
  location: { label: string | null } | null;
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [actionPending, startAction] = useTransition();

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
        <Sheet open={open} onOpenChange={setOpen}>
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
                sheetOpen={open}
                onSuccess={() => setOpen(false)}
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

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            illustration={<ListHero className="w-full" />}
            title="Empty list"
            description="Add your first idea for two."
            action={
              <Button onClick={() => setOpen(true)}>Add an entry</Button>
            }
          />
        ) : (
          filtered.map((task) => (
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
              />
              <div className="flex flex-wrap gap-2 px-1">
                {task.status !== "done" ? (
                  <Button
                    type="button"
                    variant="on-color"
                    size="sm"
                    disabled={actionPending}
                    onClick={() =>
                      startAction(() => updateTaskStatus(task.id, "done"))
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
                      startAction(() =>
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
                  onClick={() => startAction(() => deleteTask(task.id))}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
