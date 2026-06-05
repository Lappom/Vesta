import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { MapView } from "@/components/carte/MapView";
import { getUserCouple } from "@/lib/couple";
import { getTasksWithLocation } from "@/lib/actions/task-actions";
import { getCategoryStyle } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function CartePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const couple = await getUserCouple(session.user.id);
  if (!couple) redirect("/onboarding");

  const tasks = await getTasksWithLocation();
  const withLocation = tasks.filter((task) => task.location);

  const markers = withLocation.map((task) => ({
    id: task.id,
    lat: task.location!.lat,
    lng: task.location!.lng,
    color: getCategoryStyle(task.category.slug).bg,
    title: task.title,
    category: task.category.name,
  }));

  return (
    <AppShell title="Carte">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {withLocation.length} lieu{withLocation.length > 1 ? "x" : ""} sur la
          carte
        </p>
        <div className="overflow-hidden rounded-3xl border border-border shadow-sm ring-1 ring-black/5">
          <MapView markers={markers} />
        </div>
      </div>
    </AppShell>
  );
}
