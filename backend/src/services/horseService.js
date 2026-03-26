import { db } from "../config/db.js";

export async function listHorses(companyId) {
  const [rows] = await db.query(
    `SELECT id, name, tag_number AS tagNumber, birth_date AS birthDate, breed, photo_url AS photoUrl, notes, created_at AS createdAt
     FROM horses
     WHERE company_id = ?
     ORDER BY name ASC`,
    [companyId]
  );
  return rows;
}

export async function getHorseById(companyId, horseId) {
  const [rows] = await db.query(
    `SELECT id, name, tag_number AS tagNumber, birth_date AS birthDate, breed, photo_url AS photoUrl, notes, created_at AS createdAt
     FROM horses
     WHERE company_id = ? AND id = ?
     LIMIT 1`,
    [companyId, horseId]
  );
  if (!rows[0]) {
    const error = new Error("Cavalo nao encontrado.");
    error.status = 404;
    throw error;
  }
  return rows[0];
}

export async function createHorse(companyId, payload) {
  const [result] = await db.query(
    `INSERT INTO horses (company_id, name, tag_number, birth_date, breed, photo_url, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [companyId, payload.name, payload.tagNumber, payload.birthDate || null, payload.breed, payload.photoUrl || null, payload.notes || null]
  );
  return getHorseById(companyId, result.insertId);
}

export async function updateHorse(companyId, horseId, payload) {
  await getHorseById(companyId, horseId);
  await db.query(
    `UPDATE horses
     SET name = ?, tag_number = ?, birth_date = ?, breed = ?, photo_url = ?, notes = ?
     WHERE company_id = ? AND id = ?`,
    [payload.name, payload.tagNumber, payload.birthDate || null, payload.breed, payload.photoUrl || null, payload.notes || null, companyId, horseId]
  );
  return getHorseById(companyId, horseId);
}

export async function deleteHorse(companyId, horseId) {
  await getHorseById(companyId, horseId);
  await db.query("DELETE FROM horses WHERE company_id = ? AND id = ?", [companyId, horseId]);
}
