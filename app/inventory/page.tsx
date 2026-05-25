import { InventoryPageClient } from "@/components/inventory-page-client";
import { getCars } from "@/api/cars";

export default async function InventoryPage() {
  const inventory = (await getCars()).filter((vehicle) => vehicle.status === "available");

  return <InventoryPageClient vehicles={inventory} mode="inventory" />;
}
