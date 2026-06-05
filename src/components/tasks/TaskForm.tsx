"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/actions/task-actions";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type TaskFormProps = {
  categories: Category[];
  onSuccess?: () => void;
};

const selectClassName = cn(
  "flex h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
);

export function TaskForm({ categories, onSuccess }: TaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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
          id="locationLabel"
          name="locationLabel"
          placeholder="Restaurant, parc, chez nous…"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude</Label>
          <Input id="lat" name="lat" placeholder="48.8566" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitude</Label>
          <Input id="lng" name="lng" placeholder="2.3522" />
        </div>
      </div>

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

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Ajout…" : "Ajouter à notre liste"}
      </Button>
    </form>
  );
}
