import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";

function AppShellFallback() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
