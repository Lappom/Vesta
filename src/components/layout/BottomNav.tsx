"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Heart,
  Home,
  ListTodo,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/list", label: "List", icon: ListTodo },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/memories", label: "Memories", icon: Heart },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-hairline bg-background px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full px-1 py-1 text-[11px] font-medium transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97]",
                  active
                    ? "bg-surface-card text-ink"
                    : "text-muted-foreground can-hover:hover:text-ink"
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
