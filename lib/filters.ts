import type { Vehicle } from "@/data/vehicles";

export type Filters = {
  maxPrice: string;
  minYear: string;
  make: string;
  maxMileage: string;
};

export type FilterOptions = {
  prices: number[];
  years: number[];
  makes: string[];
  mileages: number[];
};

export function getFilterOptions(vehicles: Vehicle[]): FilterOptions {
  const maxPrice = Math.max(...vehicles.map((vehicle) => vehicle.price), 0);
  const maxMileage = Math.max(...vehicles.map((vehicle) => vehicle.mileage), 0);
  const prices = buildPriceBuckets(maxPrice);
  const years = [...new Set(vehicles.map((vehicle) => vehicle.year))].sort((a, b) => b - a);
  const makes = ["All makes", ...new Set(vehicles.map((vehicle) => vehicle.make).sort())];
  const mileages = buildMileageBuckets(maxMileage);

  return { prices, years, makes, mileages };
}

export function matchesFilters(vehicle: Vehicle, filters: Filters) {
  const pricePass = !filters.maxPrice || vehicle.price <= Number(filters.maxPrice);
  const yearPass = !filters.minYear || vehicle.year >= Number(filters.minYear);
  const makePass = filters.make === "All makes" || vehicle.make === filters.make;
  const mileagePass = !filters.maxMileage || vehicle.mileage <= Number(filters.maxMileage);

  return pricePass && yearPass && makePass && mileagePass;
}

function buildPriceBuckets(maxPrice: number) {
  const standardBuckets = [15000, 20000, 25000, 30000, 35000, 40000, 50000, 60000, 75000, 100000];
  return uniqueSorted(
    standardBuckets.filter((bucket) => bucket < maxPrice).concat(maxPrice > 0 ? [roundUp(maxPrice, 5000)] : [])
  );
}

function buildMileageBuckets(maxMileage: number) {
  const standardBuckets = [25000, 50000, 75000, 100000, 125000, 150000];
  return uniqueSorted(
    standardBuckets.filter((bucket) => bucket < maxMileage).concat(maxMileage > 0 ? [roundUp(maxMileage, 10000)] : [])
  );
}

function roundUp(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

function uniqueSorted(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}
