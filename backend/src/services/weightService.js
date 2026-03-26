import { db } from "../config/db.js";

export async function listWeights(companyId, horseId) {
  const [rows] = await db.query(
    `SELECT id, horse_id AS horseId, record_date AS recordDate, weight_kg AS weightKg, notes, created_at AS createdAt
     FROM weight_records
     WHERE company_id = ? AND horse_id = ?
     ORDER BY record_date DESC, id DESC`,
    [companyId, horseId]
  );

  return rows.map((item, index, list) => {
    const previous = list[index + 1];
    const trend = previous
      ? item.weightKg > previous.weightKg
        ? "gaining"
        : item.weightKg < previous.weightKg
          ? "losing"
          : "stable"
      : "stable";
    return { ...item, trend };
  });
}

export async function createWeight(companyId, horseId, payload) {
  await db.query(
    `INSERT INTO weight_records (company_id, horse_id, record_date, weight_kg, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [companyId, horseId, payload.recordDate, payload.weightKg, payload.notes || null]
  );
  return (await listWeights(companyId, horseId))[0];
}
