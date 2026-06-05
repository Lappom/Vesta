"use client";

import { TaskMap, type MapMarker } from "@/components/ui/map";

type MapViewProps = {
  markers: MapMarker[];
};

export function MapView({ markers }: MapViewProps) {
  return <TaskMap markers={markers} />;
}
