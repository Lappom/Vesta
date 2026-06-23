"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Heart,
  Home,
  ListTodo,
  LogOut,
  MapPin,
  Settings,
} from "lucide-react";
import { VestaBrand } from "@/components/brand/VestaBrand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/list", label: "List", icon: ListTodo },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/memories", label: "Memories", icon: Heart },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

type SidebarProps = {
  userName?: string | null;
  onLogout: () => Promise<void>;
};

export function Sidebar({ userName, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:self-start lg:flex-col lg:overflow-y-auto lg:border-r lg:border-hairline lg:bg-background">
      <div className="flex h-16 items-center border-b border-hairline px-5">
        <VestaBrand href="/dashboard" size="md" />
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97]",
                    active
                      ? "bg-surface-card text-ink"
                      : "text-muted-foreground can-hover:hover:bg-muted can-hover:hover:text-ink"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-hairline p-4">
        {userName ? (
          <p className="mb-3 truncate text-sm text-muted-foreground">
            {userName}
          </p>
        ) : null}
        <form action={onLogout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="size-4" aria-hidden />
            Log out
          </Button>
        </form>
      </div>
    </aside>
  );
}
