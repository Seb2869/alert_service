import pkg from "pg";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
const { Pool } = pkg;
const envPath = "../.env";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(__dirname, envPath),
});

export const getPgPool = () => {
  try {
    const pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      max: 100,
    });
    pool.connect();
    return pool;
  } catch (error) {
    console.log("getPgPool", error);
    return null;
  }
};











