import { auth } from "@/auth";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { getUserCouple } from "@/lib/couple";
import { logoutUser } from "@/lib/actions/auth-actions";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
};

export async function AppShell({ children, title }: AppShellProps) {
  const session = await auth();
  const couple = session?.user?.id
    ? await getUserCouple(session.user.id)
    : null;

  return (
    <div className="flex min-h-dvh w-full bg-background">
      {couple ? (
        <Sidebar userName={session?.user?.name} onLogout={logoutUser} />
      ) : null}
      <div className="flex min-h-dvh flex-1 flex-col">
        <TopNav userName={session?.user?.name} title={title} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">
          {children}
        </main>
        {couple ? <BottomNav /> : null}
      </div>
    </div>
  );
}
