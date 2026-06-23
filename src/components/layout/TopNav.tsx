"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { VestaBrand } from "@/components/brand/VestaBrand";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Home",
  "/list": "List",
  "/map": "Map",
  "/memories": "Memories",
  "/stats": "Stats",
  "/settings": "Settings",
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
  const settingsActive = pathname.startsWith("/settings");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-hairline bg-background px-4 lg:hidden">
      <VestaBrand
        href="/dashboard"
        size="md"
        wordmark={resolvedTitle}
        suppressHydrationWarning
      />
      <div className="flex shrink-0 items-center gap-2">
        {userName ? (
          <span className="max-w-[7rem] truncate text-sm text-muted-foreground sm:max-w-[10rem]">
            {userName}
          </span>
        ) : null}
        <Link
          href="/settings"
          aria-label="Settings"
          aria-current={settingsActive ? "page" : undefined}
          className={cn(
            "flex size-10 items-center justify-center rounded-full transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97]",
            settingsActive
              ? "bg-surface-card text-ink"
              : "text-muted-foreground can-hover:hover:bg-muted can-hover:hover:text-ink"
          )}
        >
          <Settings className="size-5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
