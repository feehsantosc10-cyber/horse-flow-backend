import { db } from "../config/db.js";

export async function listFeedings(companyId, horseId) {
  const [rows] = await db.query(
    `SELECT id, horse_id AS horseId, feeding_date AS feedingDate, feed_type AS feedType,
            feed_quantity_kg AS feedQuantityKg, hay_quantity_kg AS hayQuantityKg, notes, created_at AS createdAt
     FROM feeding_records
     WHERE company_id = ? AND horse_id = ?
     ORDER BY feeding_date DESC, id DESC`,
    [companyId, horseId]
  );
  return rows;
}

export async function createFeeding(companyId, horseId, payload) {
  await db.query(
    `INSERT INTO feeding_records (company_id, horse_id, feeding_date, feed_type, feed_quantity_kg, hay_quantity_kg, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [companyId, horseId, payload.feedingDate, payload.feedType, payload.feedQuantityKg, payload.hayQuantityKg, payload.notes || null]
  );
  return (await listFeedings(companyId, horseId))[0];
}
