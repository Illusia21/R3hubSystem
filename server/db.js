import pkg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pkg
const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
    connectionString,
    // Neon needs SSL; local Postgres doesn't
    ssl: connectionString?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : false,
})