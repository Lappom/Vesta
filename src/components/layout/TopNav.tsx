"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/tableau-de-bord": "Accueil",
  "/liste": "Liste",
  "/carte": "Carte",
  "/souvenirs": "Souvenirs",
  "/stats": "Stats",
  "/parametres": "Réglages",
};

type TopNavProps = {
  userName?: string | null;
  title?: string;
};

export function TopNav({ userName, title }: TopNavProps) {
  const pathname = usePathname();
  const resolvedTitle =
    title ??
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ??
    "Vesta";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-hairline bg-background px-4 lg:hidden">
      <Link href="/tableau-de-bord" className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Heart className="size-4" aria-hidden />
        </span>
        <span className="font-display text-lg text-ink">{resolvedTitle}</span>
      </Link>
      {userName ? (
        <span className="max-w-[40%] truncate text-sm text-muted-foreground">
          {userName}
        </span>
      ) : null}
    </header>
  );
}
