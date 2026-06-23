import { Suspense } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Skeleton } from "@/components/ui/skeleton";
import { logoutUser } from "@/lib/actions/auth-actions";
import { getCachedCouple } from "@/lib/session";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
};

function MainFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="hidden h-8 w-48 lg:block" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

export async function AppShell({ children, title }: AppShellProps) {
  const { session, couple } = await getCachedCouple();

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {couple ? (
        <Sidebar userName={session?.user?.name} onLogout={logoutUser} />
      ) : null}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <TopNav userName={session?.user?.name} title={title} />
        <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">
          <Suspense fallback={<MainFallback />}>{children}</Suspense>
        </main>
        {couple ? <BottomNav /> : null}
      </div>
    </div>
  );
}
