import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  q: z.string().trim().min(3, "Search must be at least 3 characters"),
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
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
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
        "Accept-Language": "en",
      },
      next: { revalidate: 3600 },
    });

    if (response.status === 429) {
      return NextResponse.json(
        { error: "Too many searches, please try again shortly" },
        { status: 429 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Search service is unavailable" },
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
      { error: "Unable to reach search service" },
      { status: 502 },
    );
  }
}
