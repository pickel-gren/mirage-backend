import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { cartItems } from "../db/schema/cartItems.js";
import { products } from "../db/schema/products.js";
import { HttpError } from "../utils/http-error.js";

const MAX_QUANTITY = 99;

function parseQuantity(value) {
  const quantity = Number(value);

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY
  ) {
    throw new HttpError(
      400,
      `Quantity must be an integer between 1 and ${MAX_QUANTITY}`,
      "INVALID_CART_QUANTITY",
    );
  }

  return quantity;
}

function serializeCartItem(row) {
  return {
    id: row.cartItem.id,
    productId: row.product.id,
    name: row.product.name,
    price: Number(row.product.price),
    category: row.product.category,
    image: row.product.image,
    details: row.product.details,
    quantity: row.cartItem.quantity,
  };
}

function calculateTotal(items) {
  return items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);
}

export async function getUserCart(userId) {
  const rows = await db
    .select({
      cartItem: cartItems,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(products.active, true),
      ),
    )
    .orderBy(asc(cartItems.createdAt));

  const items = rows.map(serializeCartItem);

  return {
    items,
    total: calculateTotal(items),
  };
}

export async function setCartItemQuantity(userId, productId, value) {
  const quantity = parseQuantity(value);

  const activeProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.active, true),
      ),
    )
    .limit(1);

  if (!activeProducts[0]) {
    throw new HttpError(
      404,
      "Product not found",
      "PRODUCT_NOT_FOUND",
    );
  }

  const existingItems = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
      ),
    )
    .limit(1);

  if (existingItems[0]) {
    await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, existingItems[0].id));
  } else {
    await db.insert(cartItems).values({
      userId,
      productId,
      quantity,
    });
  }

  return getUserCart(userId);
}

export async function removeCartItem(userId, productId) {
  await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
      ),
    );

  return getUserCart(userId);
}

export async function clearUserCart(userId) {
  await db
    .delete(cartItems)
    .where(eq(cartItems.userId, userId));

  return {
    items: [],
    total: "0.00",
  };
}
