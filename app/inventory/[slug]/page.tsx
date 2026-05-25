import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarBySlug } from "@/api/cars";
import { formatCurrency, formatMileage } from "@/lib/formatters";

export default async function CarDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getCarBySlug(slug);

  if (!vehicle) notFound();

  const specs = [
    { label: "Body style", value: vehicle.bodyStyle },
    { label: "Drivetrain", value: vehicle.drivetrain },
    { label: "Fuel type", value: vehicle.fuelType },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Exterior", value: vehicle.exteriorColor },
    { label: "Interior", value: vehicle.interiorColor },
    { label: "Engine", value: vehicle.engine },
    { label: "Mileage", value: `${formatMileage(vehicle.mileage)} mi` },
    { label: "VIN", value: vehicle.vin },
    { label: "Stock no.", value: vehicle.stockNumber }
  ].filter((spec) => spec.value);

  return (
    <div className="section">
      <div className="container">
        <div className="stack-xl">
          <Link href="/inventory" className="back-link">
            <span aria-hidden="true">←</span>
            <span>Back to inventory</span>
          </Link>

          <div className="detail-image glass-card">
            <Image
              src={vehicle.image}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="vehicle-badges">
              <span className="tag">{vehicle.year}</span>
              <span className="tag">{vehicle.make}</span>
              <span className="tag">{vehicle.status === "available" ? "Available" : "Sold"}</span>
            </div>
          </div>

          {vehicle.gallery.length > 0 ? (
            <div className="detail-gallery">
              {vehicle.gallery.map((url, index) => (
                <div key={url} className="glass-card detail-gallery-card">
                  <Image
                    src={url}
                    alt={`${vehicle.make} ${vehicle.model} photo ${index + 1}`}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="details-grid">
            <div className="detail-copy">
              <div className="page-intro">
                <div className="eyebrow">Vehicle overview</div>
                <h1 className="section-title">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                {vehicle.trim ? <div className="muted">{vehicle.trim}</div> : null}
              </div>

              <div className="detail-price">{formatCurrency(vehicle.price)}</div>

              <div className="vehicle-detail-meta">
                <span className="tag">{formatMileage(vehicle.mileage)} mi</span>
                {vehicle.fuelType ? <span className="tag">{vehicle.fuelType}</span> : null}
                {vehicle.transmission ? <span className="tag">{vehicle.transmission}</span> : null}
                {vehicle.drivetrain ? <span className="tag">{vehicle.drivetrain}</span> : null}
                {vehicle.mpg ? <span className="tag">{vehicle.mpg}</span> : null}
              </div>

              {vehicle.description ? (
                <p className="section-copy">{vehicle.description}</p>
              ) : null}

              {vehicle.features?.length ? (
                <div className="stack-lg">
                  <div className="eyebrow">Key features</div>
                  <div className="detail-feature-grid">
                    {vehicle.features.map((feature) => (
                      <div key={feature} className="detail-feature">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {vehicle.status === "available" ? (
                <a
                  href={`mailto:info@arzauto.com?subject=Inquiry about ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.stockNumber})`}
                  className="pill pill-primary"
                  style={{ width: "fit-content" }}
                >
                  Inquire about this car
                </a>
              ) : null}
            </div>

            <div className="glass-card detail-specs-card">
              <div className="eyebrow">Specifications</div>
              {specs.map((spec) => (
                <div key={spec.label} className="detail-spec-row">
                  <span className="muted">{spec.label}</span>
                  <span style={{ fontWeight: 500, textAlign: "right" }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
