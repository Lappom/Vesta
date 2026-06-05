"use client";

import { usePathname } from "next/navigation";
import { VestaBrand } from "@/components/brand/VestaBrand";

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
      <VestaBrand
        href="/tableau-de-bord"
        size="md"
        wordmark={resolvedTitle}
        suppressHydrationWarning
      />
      {userName ? (
        <span className="max-w-[40%] truncate text-sm text-muted-foreground">
          {userName}
        </span>
      ) : null}
    </header>
  );
}
