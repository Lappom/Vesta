import { MapHero } from "@/components/illustrations/MapHero";
import { MapView } from "@/components/carte/MapView";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { getTasksWithLocation } from "@/lib/actions/task-actions";
import { categoryStyles, getCategoryStyle } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function CartePage() {
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
    <div className="stagger-children space-y-6">
      <PageHeader
        caption="Carte"
        title="Nos lieux"
        description={`${withLocation.length} lieu${withLocation.length > 1 ? "x" : ""} sur la carte`}
        illustration={<MapHero className="w-full" />}
      />

      <div className="overflow-hidden rounded-xl border border-hairline bg-background">
        <MapView markers={markers} />
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.values(categoryStyles).map((category) => (
          <Badge
            key={category.slug}
            variant="pill"
            className="gap-2"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: category.bg }}
            />
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
