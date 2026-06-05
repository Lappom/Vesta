import { VestaBrand } from "@/components/brand/VestaBrand";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 bg-canvas px-6 py-12 text-center">
      <VestaBrand size="lg" />
      <div className="flex max-w-sm flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-card">
          <WifiOff className="size-7 text-muted-foreground" aria-hidden />
        </div>
        <h1 className="font-display text-2xl text-ink">You&apos;re offline</h1>
        <p className="text-sm text-body">
          Vesta needs a connection to load new content. Reconnect and try again.
        </p>
      </div>
    </main>
  );
}
