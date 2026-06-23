"use client";

import type { MapMouseEvent } from "maplibre-gl";
import { Loader2, MapPin, Search, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  useMap,
} from "@/components/ui/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type Coords = { lat: number; lng: number };

type GeocodeResult = {
  label: string;
  lat: number;
  lng: number;
};

type LocationPickerProps = {
  active?: boolean;
  onLabelSuggest?: (label: string) => void;
  initialPoint?: Coords | null;
};

const DEFAULT_CENTER: [number, number] = [2.3522, 48.8566];
const MARKER_COLOR = "var(--brand-pink)";

function MapClickHandler({ onPick }: { onPick: (coords: Coords) => void }) {
  const { map, isLoaded } = useMap();
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const handleClick = (event: MapMouseEvent) => {
      onPickRef.current({ lat: event.lngLat.lat, lng: event.lngLat.lng });
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded]);

  return null;
}

function MapResizeHandler({ active }: { active: boolean }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !active) return;

    const frame = requestAnimationFrame(() => {
      map.resize();
    });

    const timeout = setTimeout(() => map.resize(), 300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [map, isLoaded, active]);

  return null;
}

function MapFlyTo({ target }: { target: Coords | null }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !target) return;

    map.flyTo({
      center: [target.lng, target.lat],
      zoom: Math.max(map.getZoom(), 14),
      duration: 900,
    });
  }, [map, isLoaded, target]);

  return null;
}

export function LocationPicker({
  active = true,
  onLabelSuggest,
  initialPoint = null,
}: LocationPickerProps) {
  const listboxId = useId();
  const searchRef = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<Coords | null>(initialPoint);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [flyTarget, setFlyTarget] = useState<Coords | null>(null);

  const placePoint = useCallback((coords: Coords) => {
    setPoint(coords);
    setFlyTarget(null);
  }, []);

  const handlePick = useCallback((coords: Coords) => {
    setPoint(coords);
  }, []);

  const handleClear = useCallback(() => {
    setPoint(null);
    setFlyTarget(null);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchError(null);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 3) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/geocode?q=${encodeURIComponent(query)}`,
        );
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setSuggestions([]);
          setSearchError(data.error ?? "Search failed");
          return;
        }

        setSuggestions(data.results ?? []);
        setShowSuggestions(true);
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setSearchError("Search failed");
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelectSuggestion = (result: GeocodeResult) => {
    const coords = { lat: result.lat, lng: result.lng };
    setPoint(coords);
    setFlyTarget(coords);
    setSearchQuery(result.label.split(",").slice(0, 2).join(", "));
    setShowSuggestions(false);
    onLabelSuggest?.(result.label.split(",").slice(0, 2).join(", "));
  };

  const handleLocate = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      const next = { lat: coords.latitude, lng: coords.longitude };
      setPoint(next);
      setFlyTarget(next);
    },
    [],
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="location-search">Map position (optional)</Label>

      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location-search"
            type="search"
            value={searchQuery}
            onChange={(event) => {
              const value = event.target.value;
              const trimmed = value.trim();
              setSearchQuery(value);
              if (trimmed.length < 3) {
                setSuggestions([]);
                setSearchError(null);
                setSearching(false);
                setShowSuggestions(false);
                return;
              }
              setSearching(true);
              setSearchError(null);
            }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for an address…"
            className="h-11 pl-9"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
          />
          {searching ? (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : null}
        </div>

        {showSuggestions && suggestions.length > 0 ? (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-hairline bg-popover py-1 shadow-md"
          >
            {suggestions.map((result) => (
              <li key={`${result.lat}-${result.lng}-${result.label}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-[transform,background-color,color] duration-150 ease-out can-hover:hover:bg-accent active:scale-[0.97]"
                  onClick={() => handleSelectSuggestion(result)}
                >
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-brand-pink" />
                  <span className="line-clamp-2">{result.label}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {searchError ? (
        <p className="text-xs text-destructive">{searchError}</p>
      ) : null}

      <div className="overflow-hidden rounded-xl ring-1 ring-hairline">
        <div className="h-[min(180px,28dvh)] w-full sm:h-[220px]">
          <Map
            center={point ? [point.lng, point.lat] : DEFAULT_CENTER}
            zoom={point ? 14 : 5}
            className="h-full w-full"
          >
            <MapResizeHandler active={active} />
            <MapClickHandler onPick={handlePick} />
            <MapFlyTo target={flyTarget} />
            <MapControls
              position="top-right"
              showZoom
              showLocate
              onLocate={handleLocate}
            />
            {point ? (
              <MapMarker
                longitude={point.lng}
                latitude={point.lat}
                draggable
                onDragEnd={(lngLat) => placePoint({ lat: lngLat.lat, lng: lngLat.lng })}
              >
                <MarkerContent>
                  <div
                    className="group relative flex size-6 items-center justify-center animate-in zoom-in-95 duration-300"
                    aria-hidden
                  >
                    <span
                      className="absolute inset-0 rounded-full opacity-40 blur-sm transition-transform duration-200 ease-out can-hover:group-hover:scale-125"
                      style={{ backgroundColor: MARKER_COLOR }}
                    />
                    <span
                      className="relative size-5 rounded-full border-2 border-white shadow-md ring-1 ring-black/5"
                      style={{ backgroundColor: MARKER_COLOR }}
                    />
                  </div>
                </MarkerContent>
              </MapMarker>
            ) : null}
          </Map>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {point
            ? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`
            : "Click the map or drag the pin"}
        </p>
        {point ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 gap-1 text-xs"
            onClick={handleClear}
          >
            <X className="size-3" />
            Clear
          </Button>
        ) : null}
      </div>

      <input type="hidden" name="lat" value={point?.lat ?? ""} />
      <input type="hidden" name="lng" value={point?.lng ?? ""} />
    </div>
  );
}
