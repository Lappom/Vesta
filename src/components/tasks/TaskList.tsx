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
    <div className="stagger-children space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          caption="Liste"
          title="Notre liste"
          description="Sorties, dates et moments à vivre ensemble."
          illustration={<ListHero className="w-full" />}
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button className="shrink-0" />}
          >
            <span className="lg:hidden">Ajouter</span>
            <span className="hidden lg:inline">Ajouter une entrée</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[90dvh] overflow-y-auto sm:max-w-lg sm:mx-auto"
          >
            <SheetHeader>
              <SheetTitle className="font-display text-display-sm">
                Nouvelle entrée
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
        aria-label="Filtrer par catégorie"
      />

      <CategoryTabs
        items={statusFilters}
        value={statusFilter}
        onChange={setStatusFilter}
        aria-label="Filtrer par statut"
      />

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            illustration={<ListHero className="w-full" />}
            title="Liste vide"
            description="Ajoutez votre première idée à deux."
            action={
              <Button onClick={() => setOpen(true)}>Ajouter une entrée</Button>
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
