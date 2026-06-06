"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type HeroProps = { className?: string };

const illustrations = {
  dashboard: dynamic(() =>
    import("@/components/illustrations/DashboardHero").then((m) => ({
      default: m.DashboardHero,
    })),
  ),
  list: dynamic(() =>
    import("@/components/illustrations/ListHero").then((m) => ({
      default: m.ListHero,
    })),
  ),
  map: dynamic(() =>
    import("@/components/illustrations/MapHero").then((m) => ({
      default: m.MapHero,
    })),
  ),
  memories: dynamic(() =>
    import("@/components/illustrations/MemoriesHero").then((m) => ({
      default: m.MemoriesHero,
    })),
  ),
  stats: dynamic(() =>
    import("@/components/illustrations/StatsHero").then((m) => ({
      default: m.StatsHero,
    })),
  ),
} satisfies Record<string, ComponentType<HeroProps>>;

export type IllustrationId = keyof typeof illustrations;

type IllustrationSlotProps = {
  id: IllustrationId;
  className?: string;
};

export function IllustrationSlot({ id, className }: IllustrationSlotProps) {
  const Illustration = illustrations[id];
  return <Illustration className={className} />;
}
