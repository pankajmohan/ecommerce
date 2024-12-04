const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Check if DATABASE_URL is available in the environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }, // Disable SSL for local dev
});

module.exports = pool;
