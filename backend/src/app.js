import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authMiddleware } from "./middleware/auth.js";
import { adminOnly } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import horseRoutes from "./routes/horseRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem nao permitida pelo CORS."));
    },
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", (req, res) => {
  res.json({ status: "ok", service: "Horse Flow API", version: "1.0.0" });
});

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Horse Flow API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/horses", authMiddleware, horseRoutes);
app.use("/api/alerts", authMiddleware, alertRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/admin", authMiddleware, adminOnly, adminRoutes);

app.use(errorHandler);
