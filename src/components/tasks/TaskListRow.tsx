"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { getCategoryStyle } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type TaskListRowProps = {
  title: string;
  categorySlug: string;
  status: "todo" | "in_progress" | "done";
  dueAt?: Date | null;
  onClick?: () => void;
};

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
} as const;

const statusShortLabels = {
  todo: "Todo",
  in_progress: "Active",
  done: "Done",
} as const;

export function TaskListRow({
  title,
  categorySlug,
  status,
  dueAt,
  onClick,
}: TaskListRowProps) {
  const style = getCategoryStyle(categorySlug);
  const dueLabel = dueAt
    ? format(dueAt, "MMM d", { locale: enUS })
    : "—";

  return (
    <div
      role="row"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "grid min-w-0 grid-cols-[minmax(0,1fr)_5.75rem_3.75rem] items-center gap-x-2 gap-y-0 px-3 py-2.5 text-sm",
        onClick && "cursor-pointer active:opacity-90",
      )}
      style={{ backgroundColor: style.bg, color: style.text }}
      title={title}
    >
      <div role="cell" className="min-w-0">
        <p className="truncate font-medium leading-snug">{title}</p>
      </div>
      <div role="cell" className="min-w-0 justify-self-end">
        <Badge
          variant="on-color"
          className="max-w-full !h-5 !px-2 !text-[10px] !leading-none"
          title={statusLabels[status]}
        >
          <span className="truncate">{statusShortLabels[status]}</span>
        </Badge>
      </div>
      <div
        role="cell"
        className="min-w-0 truncate text-right text-xs tabular-nums opacity-90"
        title={dueAt ? format(dueAt, "MMM d, yyyy", { locale: enUS }) : undefined}
      >
        {dueLabel}
      </div>
    </div>
  );
}
