import { db } from "../config/db.js";

export async function listReproductionRecords(companyId, horseId) {
  const [rows] = await db.query(
    `SELECT id, horse_id AS horseId, breeding_date AS breedingDate, estimated_birth_date AS estimatedBirthDate,
            actual_birth_date AS actualBirthDate, weaning_date AS weaningDate, notes, created_at AS createdAt
     FROM reproduction_records
     WHERE company_id = ? AND horse_id = ?
     ORDER BY breeding_date DESC, id DESC`,
    [companyId, horseId]
  );
  return rows;
}

export async function createReproductionRecord(companyId, horseId, payload) {
  await db.query(
    `INSERT INTO reproduction_records (company_id, horse_id, breeding_date, estimated_birth_date, actual_birth_date, weaning_date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [companyId, horseId, payload.breedingDate || null, payload.estimatedBirthDate || null, payload.actualBirthDate || null, payload.weaningDate || null, payload.notes || null]
  );
  return (await listReproductionRecords(companyId, horseId))[0];
}
