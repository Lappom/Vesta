"use client";

import { useMemo, useState, useTransition } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TaskForm } from "@/components/tasks/TaskForm";
import { updateTaskStatus, deleteTask } from "@/lib/actions/task-actions";
import { cn } from "@/lib/utils";

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
  { id: "all", label: "Tout" },
  { id: "sortie", label: "Sorties" },
  { id: "date", label: "Dates" },
  { id: "pratique", label: "Pratique" },
  { id: "intimite", label: "Intimité" },
];

const statusFilters = [
  { id: "all", label: "Tous statuts" },
  { id: "todo", label: "À faire" },
  { id: "in_progress", label: "En cours" },
  { id: "done", label: "Fait" },
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Notre liste</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Ajouter
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Nouvelle entrée</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <TaskForm categories={categories} onSuccess={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setCategoryFilter(filter.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium",
              categoryFilter === filter.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium",
              statusFilter === filter.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-muted p-8 text-center text-muted-foreground">
            Aucune entrée pour l&apos;instant. Ajoutez votre première idée à deux.
          </div>
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
              <div className="flex gap-2">
                {task.status !== "done" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={actionPending}
                    onClick={() =>
                      startAction(() => updateTaskStatus(task.id, "done"))
                    }
                  >
                    Marquer fait
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
                    En cours
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={actionPending}
                  onClick={() => startAction(() => deleteTask(task.id))}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
