"use client";

import MapLibreGL from "maplibre-gl";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/map";
import { colors, getCategoryStyle } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export type TaskMapMarker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  category: string;
  categorySlug: string;
};

function MapMarkerCard({
  title,
  category,
  categorySlug,
}: {
  title: string;
  category: string;
  categorySlug: string;
}) {
  const style = getCategoryStyle(categorySlug);
  const isDarkText = style.text === colors.onDark;

  return (
    <div
      className="relative min-w-[11.5rem] max-w-[15.5rem] overflow-hidden rounded-xl shadow-[0_10px_28px_-6px_rgba(10,10,10,0.18)]"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative flex gap-2.5 p-3.5 pr-9">
        <span
          className={cn(
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
            isDarkText ? "bg-white/15" : "bg-ink/8",
          )}
          aria-hidden
        >
          <MapPin className="size-3.5" strokeWidth={2.25} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-75">
            {category}
          </p>
          <h3 className="mt-0.5 font-display text-[15px] leading-snug tracking-[-0.02em]">
            {title}
          </h3>
        </div>
      </div>

      <div
        className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45"
        style={{ backgroundColor: style.bg }}
        aria-hidden
      />
    </div>
  );
}

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
            <MarkerPopup closeButton offset={[0, -4]}>
              <MapMarkerCard
                title={marker.title}
                category={marker.category}
                categorySlug={marker.categorySlug}
              />
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
