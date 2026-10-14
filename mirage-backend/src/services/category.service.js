import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { categories } from "../db/schema/categories.js";

export async function listActiveCategories() {
  return db
    .select({
      key: categories.key,
      label: categories.label,
      description: categories.description,
      icon: categories.icon,
      detailsMode: categories.detailsMode,
      sortOrder: categories.sortOrder,
    })
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(asc(categories.sortOrder));
}
