import { db } from "../config/db.js";
import { listAlerts } from "./careService.js";

export async function getDashboard(companyId) {
  const [[horseCount]] = await db.query("SELECT COUNT(*) AS totalHorses FROM horses WHERE company_id = ?", [companyId]);
  const [[feedingCount]] = await db.query(
    "SELECT COUNT(*) AS totalRecentFeedings FROM feeding_records WHERE company_id = ? AND feeding_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)",
    [companyId]
  );
  const [latestWeights] = await db.query(
    `SELECT wr.record_date AS recordDate, wr.weight_kg AS weightKg, h.name AS horseName
     FROM weight_records wr
     INNER JOIN horses h ON h.id = wr.horse_id
     WHERE wr.company_id = ?
     ORDER BY wr.record_date DESC, wr.id DESC
     LIMIT 5`,
    [companyId]
  );
  const alerts = await listAlerts(companyId);
  return {
    totalHorses: horseCount.totalHorses,
    pendingAlerts: alerts.length,
    recentFeedings: feedingCount.totalRecentFeedings,
    latestWeights,
    alerts,
  };
}
