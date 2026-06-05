"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-card">
        <AlertTriangle className="size-7 text-muted-foreground" aria-hidden />
      </div>
      <div className="max-w-sm space-y-2">
        <h1 className="font-display text-2xl text-ink">This page couldn&apos;t load</h1>
        <p className="text-sm text-body">
          A server error occurred. Reload to try again.
        </p>
        {error.digest ? (
          <p className="text-xs text-muted-foreground">ERROR {error.digest}</p>
        ) : null}
      </div>
      <Button type="button" onClick={() => reset()}>
        Reload
      </Button>
    </main>
  );
}
