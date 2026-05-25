import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/data/vehicles";
import { formatCurrency, formatMileage } from "@/lib/formatters";

type VehicleCardProps = {
  vehicle: Vehicle;
  className?: string;
};

export function VehicleCard({ vehicle, className }: VehicleCardProps) {
  const isAvailable = vehicle.status === "available";

  return (
    <article className={`glass-card vehicle-card${className ? ` ${className}` : ""}`}>
      <div className="vehicle-media">
        <Image
          src={vehicle.image}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
        <div className="vehicle-badges">
          <span className="tag">{vehicle.year}</span>
          <span className="tag">{vehicle.make}</span>
        </div>
        <div className="vehicle-overlay">
          <div className="vehicle-price">{formatCurrency(vehicle.price)}</div>
        </div>
      </div>
      <div className="vehicle-body">
        <div className="vehicle-header">
          <div>
            <h2 className="card-heading">
              {vehicle.make} {vehicle.model}
            </h2>
            <div className="muted" style={{ marginTop: 8 }}>
              {vehicle.trim} · {vehicle.bodyStyle} · {vehicle.drivetrain}
            </div>
          </div>
        </div>
        <div className="vehicle-meta">
          <span className="tag">{formatMileage(vehicle.mileage)} mi</span>
          <span className="tag">{vehicle.fuelType}</span>
          <span className="tag">{vehicle.transmission}</span>
        </div>
        <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
          {vehicle.shortDescription || vehicle.description}
        </p>
        {isAvailable ? (
          <Link className="pill pill-primary" href={`/inventory/${vehicle.slug}`}>
            View details
          </Link>
        ) : (
          <div className="pill pill-secondary" aria-label="Sold vehicle">
            Previously sold
          </div>
        )}
      </div>
    </article>
  );
}
