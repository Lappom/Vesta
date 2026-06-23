"use client";

import {
  PageHeaderIllustration,
} from "@/components/ui/page-header-illustration";
import type { IllustrationId } from "@/components/illustrations/IllustrationSlot";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  caption?: React.ReactNode;
  title: string;
  description?: string;
  illustration?: IllustrationId;
  className?: string;
};

export function PageHeaderClient({
  caption,
  title,
  description,
  illustration,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {caption ? (
          typeof caption === "string" ? (
            <p className="text-caption-uppercase text-muted-foreground">
              {caption}
            </p>
          ) : (
            caption
          )
        ) : null}
        <h1 className="hidden text-display-sm text-ink lg:block">{title}</h1>
        {description ? (
          <p className="max-w-prose text-sm text-body">{description}</p>
        ) : null}
      </div>
      {illustration ? (
        <PageHeaderIllustration illustration={illustration} />
      ) : null}
    </header>
  );
}
