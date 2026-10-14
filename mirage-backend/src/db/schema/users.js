import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  discordId: varchar("discord_id", {
    length: 32,
  })
    .notNull()
    .unique(),

  username: varchar("username", {
    length: 100,
  }).notNull(),

  avatar: varchar("avatar", {
    length: 500,
  }),

  email: varchar("email", {
    length: 320,
  }),

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
