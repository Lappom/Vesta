"use client";

import {
  IllustrationSlot,
  type IllustrationId,
} from "@/components/illustrations/IllustrationSlot";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  illustration?: IllustrationId;
  variant?: "default" | "filtered";
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  illustration,
  variant = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl bg-surface-soft px-6 py-12 text-center",
        className,
      )}
    >
      {variant === "filtered" ? (
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-card text-muted-foreground">
          <Filter className="size-7" aria-hidden />
        </div>
      ) : illustration ? (
        <div className="mb-6 w-40 opacity-90">
          <IllustrationSlot id={illustration} className="w-full" />
        </div>
      ) : null}
      <h3 className="font-display text-display-sm text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
