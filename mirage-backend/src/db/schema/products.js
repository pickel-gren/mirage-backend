import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.js";

export const products = pgTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  price: decimal("price", {
    precision: 10,
    scale: 2,
    mode: "string",
  }).notNull(),

  category: varchar("category", {
    length: 64,
  })
    .notNull()
    .references(() => categories.key, {
      onDelete: "restrict",
    }),

  image: varchar("image", { length: 500 }),

  details: text("details"),

  active: boolean("active").default(true).notNull(),

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
});
