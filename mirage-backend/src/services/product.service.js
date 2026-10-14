import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { products } from "../db/schema/products.js";
import { HttpError } from "../utils/http-error.js";

const PRODUCT_CATEGORIES = new Set([
  "roles",
  "diamonds",
  "gift_cards",
]);

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    image: product.image,
    details: product.details,
    active: product.active,
  };
}

export async function listActiveProducts(category) {
  if (category && !PRODUCT_CATEGORIES.has(category)) {
    throw new HttpError(
      400,
      "Invalid product category. Allowed values: roles, diamonds, gift_cards",
      "INVALID_PRODUCT_CATEGORY",
    );
  }

  const whereCondition = category
    ? and(
        eq(products.active, true),
        eq(products.category, category),
      )
    : eq(products.active, true);

  const result = await db
    .select()
    .from(products)
    .where(whereCondition)
    .orderBy(asc(sql`CAST(${products.id} AS INTEGER)`));

  return result.map(serializeProduct);
}

export async function getActiveProductById(productId) {
  const result = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.active, true),
      ),
    )
    .limit(1);

  const product = result[0];

  if (!product) {
    throw new HttpError(
      404,
      "Product not found",
      "PRODUCT_NOT_FOUND",
    );
  }

  return serializeProduct(product);
}
