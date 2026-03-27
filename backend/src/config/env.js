import dotenv from "dotenv";

dotenv.config();

function parseAllowedOrigins() {
  const rawOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || "",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "horse_flow",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.DB_SSL === "true",
  },
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "12h",
  clientUrls: parseAllowedOrigins(),
};
