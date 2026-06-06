"use client";

import { DashboardHero } from "@/components/illustrations/DashboardHero";
import { ListHero } from "@/components/illustrations/ListHero";
import { MapHero } from "@/components/illustrations/MapHero";
import { MemoriesHero } from "@/components/illustrations/MemoriesHero";
import { StatsHero } from "@/components/illustrations/StatsHero";

const illustrations = {
  dashboard: DashboardHero,
  list: ListHero,
  map: MapHero,
  memories: MemoriesHero,
  stats: StatsHero,
} as const;

export type IllustrationId = keyof typeof illustrations;

type IllustrationSlotProps = {
  id: IllustrationId;
  className?: string;
};

export function IllustrationSlot({ id, className }: IllustrationSlotProps) {
  const Illustration = illustrations[id];
  return <Illustration className={className} />;
}
