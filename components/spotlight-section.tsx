import Link from "next/link";
import type { Vehicle } from "@/data/vehicles";
import { VehicleCard } from "@/components/vehicle-card";

type SpotlightSectionProps = {
  soldVehicles: Vehicle[];
};

export function SpotlightSection({ soldVehicles }: SpotlightSectionProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="spotlight-layout">
          <div className="dark-panel feature-panel stack-lg">
            <div className="eyebrow">Recently sold</div>
            <h2 className="section-title">A visible sold archive reinforces the trust story behind the showroom.</h2>
            <p className="section-copy">
              Buyers read sold inventory as proof of demand, pricing clarity, and dealership
              consistency. Keeping this archive visible gives ARZ the same confidence cues used by
              premium automotive brands.
            </p>
            <div className="section-actions">
              <Link className="pill pill-secondary" href="/sold">
                Explore sold inventory
              </Link>
              <Link className="pill pill-primary" href="/inventory">
                Shop current cars
              </Link>
            </div>
          </div>
          <div className="inventory-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            {soldVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
