import {
  check,
  decimal,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users.js";
import { products } from "./products.js";

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "COMPLETED",
  "CANCELED",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    status: orderStatusEnum("status")
      .notNull()
      .default("PENDING"),

    total: decimal("total", {
      precision: 10,
      scale: 2,
      mode: "string",
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "orders_total_non_negative",
      sql`${table.total} >= 0`,
    ),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    productId: varchar("product_id", { length: 64 })
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),

    quantity: integer("quantity").notNull(),

    price: decimal("price", {
      precision: 10,
      scale: 2,
      mode: "string",
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "order_items_quantity_positive",
      sql`${table.quantity} > 0`,
    ),

    check(
      "order_items_price_non_negative",
      sql`${table.price} >= 0`,
    ),
  ],
);
