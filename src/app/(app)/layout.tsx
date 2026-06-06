import { AppShell } from "@/components/layout/AppShell";
import { getCachedCouple } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getCachedCouple();

  return <AppShell>{children}</AppShell>;
}
