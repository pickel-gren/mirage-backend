import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  key: varchar("key", { length: 64 }).primaryKey(),

  label: varchar("label", { length: 100 }).notNull(),

  description: text("description").notNull(),

  icon: varchar("icon", { length: 500 }).notNull(),

  detailsMode: varchar("details_mode", {
    length: 20,
  }).notNull(),

  sortOrder: integer("sort_order").notNull(),

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
