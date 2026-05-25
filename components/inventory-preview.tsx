import Link from "next/link";
import type { Vehicle } from "@/data/vehicles";
import { VehicleCard } from "@/components/vehicle-card";

type InventoryPreviewProps = {
  eyebrow: string;
  title: string;
  description: string;
  vehicles: Vehicle[];
  href: string;
  cta: string;
};

export function InventoryPreview({
  eyebrow,
  title,
  description,
  vehicles,
  href,
  cta
}: InventoryPreviewProps) {
  return (
    <section className="section">
      <div className="container stack-lg">
        <div className="inventory-header">
          <div className="page-intro-copy">
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="section-title">{title}</h2>
            <p className="section-copy">{description}</p>
          </div>
          <Link className="pill pill-secondary" href={href}>
            {cta}
          </Link>
        </div>
        <div className="inventory-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
