import { InventoryPageClient } from "@/components/inventory-page-client";
import { getCars } from "@/api/cars";

export const dynamic = "force-dynamic";

export default async function SoldPage() {
  const all = await getCars();
  const sold = all.filter((v) => v.status === "sold");

  return <InventoryPageClient vehicles={sold} mode="sold" />;
}
