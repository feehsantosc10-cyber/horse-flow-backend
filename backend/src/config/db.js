import mysql from "mysql2/promise";
import { env } from "./env.js";

export const db = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  connectionLimit: 10,
  ...(env.db.ssl ? { ssl: { rejectUnauthorized: false } } : {}),
});
