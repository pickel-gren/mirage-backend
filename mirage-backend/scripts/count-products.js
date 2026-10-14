import { count } from "drizzle-orm";
import { db, queryClient } from "../src/db/client.js";
import { products } from "../src/db/schema/index.js";

try {
  const result = await db
    .select({ count: count() })
    .from(products);

  console.log(`📦 Product count: ${result[0].count}`);
} catch (error) {
  console.error("Error counting products:", error.message);
  process.exitCode = 1;
} finally {
  await queryClient.end();
}
