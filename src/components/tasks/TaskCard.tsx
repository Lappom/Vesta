import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getCategoryStyle } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  title: string;
  description?: string | null;
  categorySlug: string;
  categoryName: string;
  status: "todo" | "in_progress" | "done";
  assignee: "me" | "partner" | "both";
  dueAt?: Date | null;
  photoUrl?: string | null;
  locationLabel?: string | null;
  onClick?: () => void;
};

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
} as const;

const assigneeLabels = {
  me: "Me",
  partner: "Partner",
  both: "Both of us",
} as const;

export function TaskCard({
  title,
  description,
  categorySlug,
  categoryName,
  status,
  assignee,
  dueAt,
  photoUrl,
  locationLabel,
  onClick,
}: TaskCardProps) {
  const style = getCategoryStyle(categorySlug);

  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      className={cn(
        "rounded-xl p-5 transition-transform lg:p-6",
        onClick && "cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
      )}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-caption-uppercase opacity-80">{categoryName}</p>
          <h3 className="mt-1 font-display text-display-sm">{title}</h3>
        </div>
        <Badge variant="on-color">{statusLabels[status]}</Badge>
      </div>

      {description ? (
        <p className="mb-3 text-sm leading-relaxed opacity-90">{description}</p>
      ) : null}

      <div className="flex flex-wrap gap-2 text-xs opacity-90">
        <span className="rounded-full bg-white/15 px-3 py-1.5">
          {assigneeLabels[assignee]}
        </span>
        {dueAt ? (
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            {format(dueAt, "MMM d, yyyy", { locale: enUS })}
          </span>
        ) : null}
        {locationLabel ? (
          <span className="rounded-full bg-white/15 px-3 py-1.5">
            {locationLabel}
          </span>
        ) : null}
      </div>

      {photoUrl ? (
        <div className="relative mt-4 aspect-video overflow-hidden rounded-lg">
          <Image
            src={photoUrl}
            alt={`Photo for ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        </div>
      ) : null}
    </article>
  );
}
