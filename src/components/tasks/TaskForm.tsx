"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask, updateTask } from "@/lib/actions/task-actions";
import { cn } from "@/lib/utils";

const LocationPicker = dynamic(
  () =>
    import("@/components/tasks/LocationPicker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(180px,28dvh)] items-center justify-center rounded-xl ring-1 ring-hairline sm:h-[220px]">
        <p className="text-sm text-muted-foreground">Loading map…</p>
      </div>
    ),
  },
);

type Category = {
  id: string;
  name: string;
  slug: string;
};

type EditTask = {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
  assignee: "me" | "partner" | "both";
  dueAt: Date | null;
  location?: { lat: number; lng: number; label: string | null } | null;
  photoUrl?: string | null;
};

type TaskFormProps = {
  categories: Category[];
  sheetOpen?: boolean;
  onSuccess?: () => void;
  task?: EditTask;
};

const selectClassName = cn(
  "flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
);

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TaskForm({
  categories,
  sheetOpen = false,
  onSuccess,
  task,
}: TaskFormProps) {
  const isEditing = Boolean(task);
  const formRef = useRef<HTMLFormElement>(null);
  const locationLabelRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [resetSignal, setResetSignal] = useState(0);

  const initialLocation = task?.location
    ? { lat: task.location.lat, lng: task.location.lng }
    : null;

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = isEditing
            ? await updateTask(formData)
            : await createTask(formData);
          if (result?.error) {
            setError(result.error);
            return;
          }
          if (!isEditing) {
            formRef.current?.reset();
            setResetSignal((value) => value + 1);
          }
          onSuccess?.();
        });
      }}
      className="space-y-4"
    >
      {isEditing ? <input type="hidden" name="taskId" value={task!.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Candlelit dinner…"
          defaultValue={task?.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Details, ideas, notes…"
          rows={3}
          defaultValue={task?.description ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className={selectClassName}
          defaultValue={task?.categoryId ?? ""}
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assignee">For</Label>
          <select
            id="assignee"
            name="assignee"
            defaultValue={task?.assignee ?? "both"}
            className={selectClassName}
          >
            <option value="me">Me</option>
            <option value="partner">Partner</option>
            <option value="both">Both of us</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueAt">Target date</Label>
          <Input
            id="dueAt"
            name="dueAt"
            type="datetime-local"
            className="h-11"
            defaultValue={formatDateForInput(task?.dueAt ?? null)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationLabel">Location (optional)</Label>
        <Input
          ref={locationLabelRef}
          id="locationLabel"
          name="locationLabel"
          placeholder="Restaurant, park, at home…"
          defaultValue={task?.location?.label ?? ""}
        />
      </div>

      {sheetOpen ? (
        <LocationPicker
          key={isEditing ? task!.id : resetSignal}
          active={sheetOpen}
          initialPoint={initialLocation}
          onLabelSuggest={(label) => {
            if (!locationLabelRef.current?.value.trim()) {
              locationLabelRef.current!.value = label;
            }
          }}
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optional, max 5 MB)</Label>
        {task?.photoUrl ? (
          <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
            <Image
              src={task.photoUrl}
              alt="Current photo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
        ) : null}
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="h-11"
        />
        {task?.photoUrl ? (
          <p className="text-xs text-muted-foreground">
            Upload a new photo to replace the current one.
          </p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending
          ? isEditing
            ? "Saving…"
            : "Adding…"
          : isEditing
            ? "Save changes"
            : "Add to our list"}
      </Button>
    </form>
  );
}
