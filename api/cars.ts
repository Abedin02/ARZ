import { supabase } from "@/supabaseClient";
import { unstable_noStore as noStore } from "next/cache";
import type { Vehicle } from "@/data/vehicles";

type CarImageRow = {
  url: string;
  is_hero?: boolean | null;
  sort_order?: number | null;
};

type CarFeatureRow = {
  feature: string;
};

type CarRow = {
  id: string;
  stock_number: string;
  status: Vehicle["status"];
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  body_style?: string | null;
  drivetrain?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  exterior_color?: string | null;
  interior_color?: string | null;
  price: number;
  mileage?: number | null;
  mpg?: string | null;
  engine?: string | null;
  vin: string;
  location?: string | null;
  short_description?: string | null;
  description?: string | null;
  car_images?: CarImageRow[] | null;
  car_features?: CarFeatureRow[] | null;
};

function mapCarToVehicle(car: CarRow): Vehicle {
  const images = car.car_images ?? [];
  const heroImage = images.find((img) => img.is_hero)?.url ?? images[0]?.url ?? "";
  const gallery = images
    .filter((img) => !img.is_hero)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => img.url);

  return {
    id: car.id,
    slug: car.stock_number,
    status: normalizeStatus(car.status),
    year: car.year,
    make: car.make,
    model: car.model,
    trim: car.trim ?? "",
    bodyStyle: car.body_style ?? "",
    drivetrain: car.drivetrain ?? "",
    fuelType: car.fuel_type ?? "",
    transmission: car.transmission ?? "",
    exteriorColor: car.exterior_color ?? "",
    interiorColor: car.interior_color ?? "",
    price: car.price,
    mileage: car.mileage ?? 0,
    mpg: car.mpg ?? "",
    engine: car.engine ?? "",
    vin: car.vin,
    stockNumber: car.stock_number,
    location: car.location ?? "",
    image: heroImage,
    gallery,
    shortDescription: car.short_description ?? "",
    description: car.description ?? "",
    features: (car.car_features ?? []).map((feature) => feature.feature)
  };
}

function normalizeStatus(status: string | null | undefined): Vehicle["status"] {
  const normalized = status?.trim().toLowerCase();
  return normalized === "sold" ? "sold" : "available";
}

export async function getCars(): Promise<Vehicle[]> {
  noStore();

  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_images ( url, is_hero, sort_order )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as CarRow[]).map(mapCarToVehicle);
}

export async function getCarBySlug(slug: string): Promise<Vehicle | null> {
  noStore();

  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_images ( * ),
      car_features ( feature )
    `)
    .eq("stock_number", slug)
    .single();

  if (error) return null;
  return mapCarToVehicle(data as CarRow);
}

export async function addCar(carData: Record<string, unknown>) {
  const { data, error } = await supabase.from("cars").insert([carData]).select();

  if (error) throw error;
  return data;
}

export async function updateCar(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase.from("cars").update(updates).eq("id", id).select();

  if (error) throw error;
  return data;
}

export async function deleteCar(id: string) {
  const { error } = await supabase.from("cars").delete().eq("id", id);

  if (error) throw error;
}
