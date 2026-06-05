import { auth } from "@/auth";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";
import { getUserCouple } from "@/lib/couple";

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
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-background">
      <TopNav userName={session?.user?.name} title={title} />
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      {couple ? <BottomNav /> : null}
    </div>
  );
}
