import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: isProd
    ? { rejectUnauthorized: false }
    : false,

  // Pool tuning
  max: 20, 
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 5000, // fail fast if DB not reachable
});

export const db = drizzle(pool);

export const connectDb = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      const client = await pool.connect(); // temporary DB connection you borrow, use, and return

      await client.query("SELECT 1"); // use

      client.release(); //imp if client is used - return

      console.log("Database Connected!!");
      return;
    }
     catch (err) {
      retries--;
      console.error( `DB connection failed. Retries left: ${retries}`,err.message);

      if (!retries) {
        throw err; 
      }
      // wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};