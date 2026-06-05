"use client";

import MapLibreGL from "maplibre-gl";
import { useEffect } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";

export type TaskMapMarker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  category: string;
};

type MapViewProps = {
  markers: TaskMapMarker[];
  className?: string;
};

function FitMapToMarkers({
  markers,
}: {
  markers: { lng: number; lat: number }[];
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || markers.length === 0) return;

    if (markers.length === 1) {
      map.flyTo({
        center: [markers[0].lng, markers[0].lat],
        zoom: 13,
        duration: 900,
      });
      return;
    }

    const bounds = new MapLibreGL.LngLatBounds();
    markers.forEach((marker) => bounds.extend([marker.lng, marker.lat]));
    map.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 900 });
  }, [map, isLoaded, markers]);

  return null;
}

export function MapView({ markers, className }: MapViewProps) {
  const defaultCenter: [number, number] = [2.3522, 48.8566];

  return (
    <div className={cn("h-[min(55vh,480px)] min-h-[320px] w-full", className)}>
      <Map
        center={markers[0] ? [markers[0].lng, markers[0].lat] : defaultCenter}
        zoom={markers.length ? 11 : 5}
        className="h-full w-full"
      >
        <MapControls position="top-right" showZoom showLocate />
        <FitMapToMarkers markers={markers} />
        {markers.map((marker) => (
          <MapMarker
            key={marker.id}
            longitude={marker.lng}
            latitude={marker.lat}
          >
            <MarkerContent>
              <div
                className="group relative flex size-5 items-center justify-center"
                aria-hidden
              >
                <span
                  className="absolute inset-0 rounded-full opacity-40 blur-sm transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: marker.color }}
                />
                <span
                  className="relative size-4 rounded-full border-2 border-white shadow-md ring-1 ring-black/5"
                  style={{ backgroundColor: marker.color }}
                />
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <p className="text-sm leading-tight font-semibold">
                {marker.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {marker.category}
              </p>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
