"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/actions/task-actions";
import { cn } from "@/lib/utils";

const LocationPicker = dynamic(
  () =>
    import("@/components/tasks/LocationPicker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[220px] items-center justify-center rounded-xl ring-1 ring-hairline">
        <p className="text-sm text-muted-foreground">Chargement de la carte…</p>
      </div>
    ),
  },
);

type Category = {
  id: string;
  name: string;
  slug: string;
};

type TaskFormProps = {
  categories: Category[];
  sheetOpen?: boolean;
  onSuccess?: () => void;
};

const selectClassName = cn(
  "flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
);

export function TaskForm({ categories, sheetOpen = false, onSuccess }: TaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const locationLabelRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await createTask(formData);
          if (result?.error) {
            setError(result.error);
            return;
          }
          formRef.current?.reset();
          setResetSignal((value) => value + 1);
          onSuccess?.();
        });
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required placeholder="Dîner aux chandelles…" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Détails, idées, notes…"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Catégorie</Label>
        <select id="categoryId" name="categoryId" required className={selectClassName}>
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="assignee">Pour qui</Label>
          <select
            id="assignee"
            name="assignee"
            defaultValue="both"
            className={selectClassName}
          >
            <option value="me">Moi</option>
            <option value="partner">Partenaire</option>
            <option value="both">Nous deux</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueAt">Date cible</Label>
          <Input id="dueAt" name="dueAt" type="datetime-local" className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationLabel">Lieu (optionnel)</Label>
        <Input
          ref={locationLabelRef}
          id="locationLabel"
          name="locationLabel"
          placeholder="Restaurant, parc, chez nous…"
        />
      </div>

      {sheetOpen ? (
        <LocationPicker
          key={resetSignal}
          active={sheetOpen}
          onLabelSuggest={(label) => {
            if (!locationLabelRef.current?.value.trim()) {
              locationLabelRef.current!.value = label;
            }
          }}
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optionnel, max 5 Mo)</Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="h-11"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Ajout…" : "Ajouter à notre liste"}
      </Button>
    </form>
  );
}
