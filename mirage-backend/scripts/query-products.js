import { db, queryClient } from "../src/db/client.js";
import { products } from "../src/db/schema/index.js";

try {
  const result = await db.select().from(products);
  console.table(result);
} catch (error) {
  console.error("Error querying products:", error.message);
  process.exitCode = 1;
} finally {
  await queryClient.end();
}
