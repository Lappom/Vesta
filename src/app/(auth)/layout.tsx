import { Suspense } from "react";

function AuthFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<AuthFallback />}>{children}</Suspense>;
}
