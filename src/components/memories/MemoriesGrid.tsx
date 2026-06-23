"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategoryStyle } from "@/lib/design-tokens";

type MemoryItem = {
  id: string;
  title: string;
  photoUrl: string;
  category: { name: string; slug: string };
};

type MemoriesGridProps = {
  items: MemoryItem[];
};

export function MemoriesGrid({ items }: MemoriesGridProps) {
  const [selected, setSelected] = useState<MemoryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((task, index) => {
          const style = getCategoryStyle(task.category.slug);
          return (
            <article
              key={task.id}
              className="group overflow-hidden rounded-xl bg-surface-card [contain-intrinsic-size:300px] [content-visibility:auto]"
            >
              <button
                type="button"
                onClick={() => setSelected(task)}
                className="block w-full text-left active:scale-[0.99] transition-transform duration-150 ease-out"
                aria-label={`View photo: ${task.title}`}
              >
                <div className="relative aspect-square overflow-hidden bg-surface-soft">
                  <Image
                    src={task.photoUrl}
                    alt={task.title}
                    fill
                    unoptimized
                    priority={index < 4}
                    placeholder="empty"
                    className="object-cover transition-transform duration-200 ease-out can-hover:group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10"
                    style={
                      {
                        "--tw-gradient-from": `${style.bg}cc`,
                      } as React.CSSProperties
                    }
                  >
                    <p className="font-display text-sm text-white">
                      {task.title}
                    </p>
                    <p className="text-xs text-white/80">
                      {task.category.name}
                    </p>
                  </div>
                </div>
              </button>
            </article>
          );
        })}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {selected?.title ?? "Memory photo"}
          </DialogTitle>
          {selected ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={selected.photoUrl}
                alt={selected.title}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
