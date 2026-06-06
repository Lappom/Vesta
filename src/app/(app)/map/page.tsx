import { MapView } from "@/components/carte/MapView";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { getTasksWithLocation } from "@/lib/actions/task-actions";
import { categoryStyles, getCategoryStyle } from "@/lib/design-tokens";


export default async function MapPage() {
  const tasks = await getTasksWithLocation();
  const withLocation = tasks.filter((task) => task.location);

  const markers = withLocation.map((task) => ({
    id: task.id,
    lat: task.location!.lat,
    lng: task.location!.lng,
    color: getCategoryStyle(task.category.slug).bg,
    title: task.title,
    category: task.category.name,
    categorySlug: task.category.slug,
  }));

  const placeLabel =
    withLocation.length === 1
      ? "1 place on the map"
      : `${withLocation.length} places on the map`;

  return (
    <div className="stagger-children space-y-6">
      <PageHeader
        caption="Map"
        title="Our places"
        description={placeLabel}
        illustration="map"
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
