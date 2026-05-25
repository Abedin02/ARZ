import { HomeHero } from "@/components/home-hero";
import { InventoryPreview } from "@/components/inventory-preview";
import { MetricsStrip } from "@/components/metrics-strip";
import { SpotlightSection } from "@/components/spotlight-section";
import { getCars } from "@/api/cars";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vehicles = await getCars();
  const available = vehicles.filter((vehicle) => vehicle.status === "available");
  const featured = available.slice(0, 6);
  const sold = vehicles.filter((vehicle) => vehicle.status === "sold").slice(0, 3);

  return (
    <>
      <HomeHero />
      <MetricsStrip />
      <InventoryPreview
        eyebrow="Current inventory"
        title="Fresh arrivals, fully inspected and ready for the next drive."
        description="Search by budget, year, brand, and mileage without leaving the page. Every listing includes inspection notes, feature highlights, and transparent pricing."
        vehicles={featured}
        href="/inventory"
        cta="Browse all inventory"
      />
      <SpotlightSection soldVehicles={sold} />
    </>
  );
}
