"use client";

import {
  IllustrationSlot,
  type IllustrationId,
} from "@/components/illustrations/IllustrationSlot";

type PageHeaderIllustrationProps = {
  illustration: IllustrationId;
};

export function PageHeaderIllustration({
  illustration,
}: PageHeaderIllustrationProps) {
  return (
    <div className="hidden w-32 shrink-0 sm:block lg:w-40">
      <IllustrationSlot id={illustration} className="w-full" />
    </div>
  );
}
