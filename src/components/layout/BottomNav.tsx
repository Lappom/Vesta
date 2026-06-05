"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Heart,
  ListTodo,
  MapPin,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/liste", label: "Liste", icon: ListTodo },
  { href: "/carte", label: "Carte", icon: MapPin },
  { href: "/souvenirs", label: "Souvenirs", icon: Heart },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/parametres", label: "Réglages", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
    >
      <ul className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-full px-1 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
