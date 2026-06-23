"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskListMobileItem } from "@/components/tasks/TaskListMobileItem";
import { Button } from "@/components/ui/button";
import {
  CategoryTabs,
  FilterGroup,
} from "@/components/ui/category-tabs";
import { categoryStyles, colors } from "@/lib/design-tokens";
import { getTaskPhotoUrl } from "@/lib/blob";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeaderClient } from "@/components/ui/page-header.client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  completeTask,
  updateTaskStatus,
  deleteTask,
} from "@/lib/actions/task-actions";
import { toast } from "@/lib/toast";

const TaskForm = dynamic(
  () => import("@/components/tasks/TaskForm").then((m) => m.TaskForm),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    ),
  },
);

const MarkDoneDialog = dynamic(
  () =>
    import("@/components/tasks/MarkDoneDialog").then((m) => m.MarkDoneDialog),
  { ssr: false },
);

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
  {
    id: "sortie",
    label: "Outings",
    accent: categoryStyles.sortie.bg,
  },
  {
    id: "date",
    label: "Dates",
    accent: categoryStyles.date.bg,
  },
  {
    id: "pratique",
    label: "Practical",
    accent: categoryStyles.pratique.bg,
  },
  {
    id: "intimite",
    label: "Intimacy",
    accent: categoryStyles.intimite.bg,
  },
];

const statusFilters = [
  { id: "all", label: "All statuses" },
  { id: "todo", label: "To do", accent: colors.mutedSoft },
  { id: "in_progress", label: "In progress", accent: colors.brandOchre },
  { id: "done", label: "Done", accent: colors.success },
];

export function TaskList({ tasks, categories }: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [markDoneTask, setMarkDoneTask] = useState<Task | null>(null);
  const [markDoneError, setMarkDoneError] = useState<string | null>(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<Task | null>(null);
  const [actionPending, startAction] = useTransition();

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setAddOpen(true);
      router.replace("/list", { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId) return;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(`task-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-ink", "ring-offset-2");
        window.setTimeout(() => {
          el.classList.remove("ring-2", "ring-ink", "ring-offset-2");
        }, 2500);
      }
      router.replace("/list", { scroll: false });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [searchParams, router]);

  useEffect(() => {
    let lastRefresh = 0;

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastRefresh < 60_000) return;
      lastRefresh = now;
      router.refresh();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  const runAction = (action: () => Promise<void>, successMessage?: string) => {
    startAction(async () => {
      await action();
      router.refresh();
      if (successMessage) {
        toast.success(successMessage);
      }
    });
  };

  const handleDelete = (task: Task) => {
    startAction(async () => {
      await deleteTask(task.id);
      setDeleteTaskTarget(null);
      router.refresh();
      toast.success("Entry deleted");
    });
  };

  const handleMarkDoneComplete = (formData: FormData | null) => {
    if (!markDoneTask) return;

    setMarkDoneError(null);
    startAction(async () => {
      if (formData) {
        const result = await completeTask(formData);
        if (result?.error) {
          setMarkDoneError(result.error);
          return;
        }
      } else {
        await updateTaskStatus(markDoneTask.id, "done");
      }

      setMarkDoneTask(null);
      router.refresh();
      toast.success("Entry marked as done");
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

  const isFilteredEmpty = filtered.length === 0 && tasks.length > 0;

  return (
    <div className="stagger-children min-w-0 space-y-6">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <PageHeaderClient
          caption="List"
          title="Our list"
          description="Outings, dates, and moments to share together."
          illustration="list"
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
            responsive
            className="gap-0 overflow-hidden p-0"
          >
            <SheetHeader className="shrink-0 border-b border-hairline/60 px-4 pb-4 pt-1 lg:pt-4">
              <SheetTitle className="pr-8 font-display text-display-sm">
                New entry
              </SheetTitle>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
              <TaskForm
                categories={categories}
                sheetOpen={addOpen}
                onSuccess={() => {
                  setAddOpen(false);
                  router.refresh();
                  toast.success("Entry added to your list");
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <FilterGroup>
        <CategoryTabs
          label="Category"
          items={filters}
          value={categoryFilter}
          onChange={setCategoryFilter}
          aria-label="Filter by category"
        />
        <div
          aria-hidden
          className="h-px bg-hairline/50"
        />
        <CategoryTabs
          label="Status"
          items={statusFilters}
          value={statusFilter}
          onChange={setStatusFilter}
          aria-label="Filter by status"
        />
      </FilterGroup>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={isFilteredEmpty ? undefined : "list"}
          variant={isFilteredEmpty ? "filtered" : "default"}
          title={isFilteredEmpty ? "No matching entries" : "Empty list"}
          description={
            isFilteredEmpty
              ? "Try adjusting your filters to see more entries."
              : "Add your first idea for two."
          }
          action={
            isFilteredEmpty ? (
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setAddOpen(true)}>Add an entry</Button>
            )
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
                  <div key={task.id} id={`task-${task.id}`} className="scroll-mt-24">
                    <TaskListMobileItem
                    task={task}
                    actionPending={actionPending}
                    onEdit={() => setEditingTask(task)}
                    onMarkDone={() => {
                      setMarkDoneError(null);
                      setMarkDoneTask(task);
                    }}
                    onMarkInProgress={() =>
                      runAction(
                        () => updateTaskStatus(task.id, "in_progress"),
                        "Status updated",
                      )
                    }
                    onDelete={() => setDeleteTaskTarget(task)}
                  />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden space-y-4 lg:block">
            {filtered.map((task) => (
              <div key={task.id} id={`task-${task.id}`} className="scroll-mt-24 space-y-2">
                <TaskCard
                  title={task.title}
                  description={task.description}
                  categorySlug={task.category.slug}
                  categoryName={task.category.name}
                  status={task.status}
                  assignee={task.assignee}
                  dueAt={task.dueAt}
                  photoUrl={task.photo ? getTaskPhotoUrl(task.id) : null}
                  locationLabel={task.location?.label}
                  onClick={() => setEditingTask(task)}
                />
                <div className="flex flex-wrap gap-2 px-1">
                  {task.status !== "done" ? (
                    <Button
                      type="button"
                      variant="success"
                      size="sm"
                      disabled={actionPending}
                      onClick={() => {
                        setMarkDoneError(null);
                        setMarkDoneTask(task);
                      }}
                    >
                      Mark done
                    </Button>
                  ) : null}
                  {task.status === "todo" ? (
                    <Button
                      type="button"
                      variant="progress"
                      size="sm"
                      disabled={actionPending}
                      onClick={() =>
                        runAction(
                          () => updateTaskStatus(task.id, "in_progress"),
                          "Status updated",
                        )
                      }
                    >
                      In progress
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={actionPending}
                    onClick={() => setDeleteTaskTarget(task)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <MarkDoneDialog
        open={markDoneTask !== null}
        onOpenChange={(open) => {
          if (!open) {
            setMarkDoneTask(null);
            setMarkDoneError(null);
          }
        }}
        taskId={markDoneTask?.id ?? ""}
        taskTitle={markDoneTask?.title ?? ""}
        pending={actionPending}
        serverError={markDoneError}
        onComplete={handleMarkDoneComplete}
      />

      <Sheet
        open={editingTask !== null}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <SheetContent
          side="bottom"
          responsive
          className="gap-0 overflow-hidden p-0"
        >
          <SheetHeader className="shrink-0 border-b border-hairline/60 px-4 pb-4 pt-1 lg:pt-4">
            <SheetTitle className="pr-8 font-display text-display-sm">
              Edit entry
            </SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
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
                  photoUrl: editingTask.photo
                    ? getTaskPhotoUrl(editingTask.id)
                    : undefined,
                }}
                onSuccess={() => {
                  setEditingTask(null);
                  router.refresh();
                  toast.success("Entry updated");
                }}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={deleteTaskTarget !== null}
        onOpenChange={(open) => !open && setDeleteTaskTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete entry?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTaskTarget?.title}&rdquo; will be permanently
              removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={actionPending}
              onClick={() => setDeleteTaskTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={actionPending}
              onClick={() => deleteTaskTarget && handleDelete(deleteTaskTarget)}
            >
              {actionPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
