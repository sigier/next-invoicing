import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Invoices } from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_POSTGRES,
  max: 10,
});

export const db = drizzle(pool, {
  schema: {
    Invoices,
  },
});
