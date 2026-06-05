import Link from "next/link";
import { Heart } from "lucide-react";

type TopNavProps = {
  userName?: string | null;
  title?: string;
};

export function TopNav({ userName, title = "Vesta" }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4">
      <Link href="/tableau-de-bord" className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Heart className="size-4" aria-hidden />
        </span>
        <span className="text-lg font-semibold tracking-tight">{title}</span>
      </Link>
      {userName ? (
        <span className="text-sm text-muted-foreground">Bonjour, {userName}</span>
      ) : null}
    </header>
  );
}
