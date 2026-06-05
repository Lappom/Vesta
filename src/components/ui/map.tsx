"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  onClick?: () => void;
};

type TaskMapProps = {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
};

export function TaskMap({
  center = [2.3522, 48.8566],
  zoom = 11,
  markers = [],
  className,
}: TaskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: prefersDark ? DARK_STYLE : LIGHT_STYLE,
      center,
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const popup = new maplibregl.Popup({ closeButton: false, offset: 12 });
    const markerInstances: maplibregl.Marker[] = [];

    markers.forEach((marker) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className =
        "size-4 rounded-full border-2 border-white shadow-md cursor-pointer";
      el.style.backgroundColor = marker.color;
      el.setAttribute("aria-label", marker.title);

      const instance = new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

      el.addEventListener("click", () => {
        popup.setLngLat([marker.lng, marker.lat]).setHTML(marker.title).addTo(map);
        marker.onClick?.();
      });

      markerInstances.push(instance);
    });

    if (markers.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      markers.forEach((m) => bounds.extend([m.lng, m.lat]));
      map.fitBounds(bounds, { padding: 48, maxZoom: 14 });
    } else if (markers.length === 1) {
      map.flyTo({ center: [markers[0].lng, markers[0].lat], zoom: 13 });
    }

    return () => {
      markerInstances.forEach((m) => m.remove());
      popup.remove();
    };
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full min-h-[320px] w-full rounded-2xl", className)}
    />
  );
}
