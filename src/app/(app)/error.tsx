"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12">
      <EmptyState
        title="This page couldn't load"
        description={
          error.digest
            ? `A server error occurred (ERROR ${error.digest}). Reload to try again.`
            : "A server error occurred. Reload to try again."
        }
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={() => reset()}>
              Reload
            </Button>
            <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
              Go home
            </Link>
          </div>
        }
      />
    </main>
  );
}
