import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import env from "../config/env.js";

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const queryClient = postgres(env.databaseUrl, {
  max: env.nodeEnv === "production" ? 20 : 5,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
  ssl: env.databaseSsl ? "require" : undefined,
});

export const db = drizzle(queryClient);

export { queryClient };
export default db;
