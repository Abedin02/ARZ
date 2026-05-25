"use client";

import { useMemo, useState } from "react";
import { FilterPanel } from "@/components/filter-panel";
import { VehicleCard } from "@/components/vehicle-card";
import type { Vehicle } from "@/data/vehicles";
import { getFilterOptions, matchesFilters, type Filters } from "@/lib/filters";

type InventoryPageClientProps = {
  vehicles: Vehicle[];
  mode: "inventory" | "sold";
};

const defaultFilters: Filters = {
  maxPrice: "",
  minYear: "",
  make: "All makes",
  maxMileage: ""
};

export function InventoryPageClient({ vehicles, mode }: InventoryPageClientProps) {
  const isInventory = mode === "inventory";
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const options = useMemo(() => getFilterOptions(vehicles), [vehicles]);
  const filtered = useMemo(
    () => (isInventory ? vehicles.filter((vehicle) => matchesFilters(vehicle, filters)) : vehicles),
    [vehicles, filters, isInventory]
  );

  const heading = isInventory
    ? {
        eyebrow: "Live inventory",
        title: "Browse every available ARZ vehicle in one focused digital showroom.",
        description:
          "Filter by budget, year, make, and mileage while keeping pricing, trim, and visual context visible."
      }
    : {
        eyebrow: "Recently sold",
        title: "See what has already moved through the ARZ collection.",
        description:
          "The sold archive shows recent demand, pricing range, and the caliber of vehicles ARZ has been moving."
      };

  return (
    <div className="section">
      <div className="container">
        <div className="inventory-layout">
          <div className="inventory-topline">
            <div className="page-intro">
              <div className="eyebrow">{heading.eyebrow}</div>
              <h1 className="section-title">{heading.title}</h1>
              <p className="section-copy">{heading.description}</p>
            </div>
            <div
              className={isInventory ? "details-grid" : "inventory-grid"}
              style={!isInventory ? { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } : undefined}
            >
              {isInventory ? (
                <FilterPanel
                  id="inventory-search"
                  title="Refine available cars"
                  subtitle="Use price, year, make, and mileage to narrow the active showroom."
                  filters={filters}
                  options={options}
                  onChange={setFilters}
                  onReset={() => setFilters(defaultFilters)}
                />
              ) : null}
            </div>
          </div>
          <div className="inventory-grid">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
          {isInventory && filtered.length === 0 ? (
            <div className="glass-card empty-state">
              <h2 className="card-heading">No vehicles match those filters yet.</h2>
              <p className="section-copy" style={{ margin: "12px auto 0" }}>
                Reset the search and widen the budget, mileage, or model year to see more of the
                showroom.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
