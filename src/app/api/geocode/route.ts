import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().trim().min(3, "La recherche doit contenir au moins 3 caractères"),
});

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ q: searchParams.get("q") ?? "" });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide" },
      { status: 400 },
    );
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", parsed.data.q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Vesta/0.1 (couple activity tracker)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (response.status === 429) {
      return NextResponse.json(
        { error: "Trop de recherches, réessayez dans un instant" },
        { status: 429 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Le service de recherche est indisponible" },
        { status: 502 },
      );
    }

    const data = (await response.json()) as NominatimResult[];

    return NextResponse.json({
      results: data.map((item) => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de contacter le service de recherche" },
      { status: 502 },
    );
  }
}
