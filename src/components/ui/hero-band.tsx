"use client";

import {
  IllustrationSlot,
  type IllustrationId,
} from "@/components/illustrations/IllustrationSlot";
import { cn } from "@/lib/utils";

type HeroBandProps = {
  children: React.ReactNode;
  illustration?: IllustrationId;
  className?: string;
};

export function HeroBand({ children, illustration, className }: HeroBandProps) {
  return (
    <section
      className={cn(
        "grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-8",
        className,
      )}
    >
      <div className="lg:col-span-7">{children}</div>
      {illustration ? (
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl bg-surface-soft p-4 lg:p-6">
            <IllustrationSlot id={illustration} className="w-full" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
