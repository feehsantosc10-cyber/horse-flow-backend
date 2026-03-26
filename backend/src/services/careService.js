import { db } from "../config/db.js";

export async function listAlertSettings(companyId) {
  const [rows] = await db.query(
    `SELECT id, care_type AS careType, interval_days AS intervalDays, enabled
     FROM alert_settings
     WHERE company_id = ?
     ORDER BY care_type`,
    [companyId]
  );
  return rows;
}

export async function updateAlertSetting(companyId, careType, payload) {
  await db.query(
    `UPDATE alert_settings
     SET interval_days = ?, enabled = ?
     WHERE company_id = ? AND care_type = ?`,
    [payload.intervalDays, payload.enabled ? 1 : 0, companyId, careType]
  );
  const [rows] = await db.query(
    `SELECT id, care_type AS careType, interval_days AS intervalDays, enabled
     FROM alert_settings
     WHERE company_id = ? AND care_type = ?
     LIMIT 1`,
    [companyId, careType]
  );
  return rows[0];
}

export async function listCareRecords(companyId, horseId) {
  const [rows] = await db.query(
    `SELECT id, horse_id AS horseId, care_type AS careType, performed_at AS performedAt,
            next_due_at AS nextDueAt, provider_name AS providerName, notes, created_at AS createdAt
     FROM care_records
     WHERE company_id = ? AND horse_id = ?
     ORDER BY performed_at DESC, id DESC`,
    [companyId, horseId]
  );
  return rows;
}

export async function createCareRecord(companyId, horseId, payload) {
  let nextDueAt = payload.nextDueAt || null;

  if (!nextDueAt) {
    const [settings] = await db.query(
      "SELECT interval_days FROM alert_settings WHERE company_id = ? AND care_type = ? LIMIT 1",
      [companyId, payload.careType]
    );
    if (settings[0]) {
      const date = new Date(`${payload.performedAt}T00:00:00`);
      date.setDate(date.getDate() + Number(settings[0].interval_days));
      nextDueAt = date.toISOString().slice(0, 10);
    }
  }

  await db.query(
    `INSERT INTO care_records (company_id, horse_id, care_type, performed_at, next_due_at, provider_name, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [companyId, horseId, payload.careType, payload.performedAt, nextDueAt, payload.providerName || null, payload.notes || null]
  );
  return (await listCareRecords(companyId, horseId))[0];
}

export async function listAlerts(companyId) {
  const [rows] = await db.query(
    `SELECT cr.id, cr.care_type AS careType, cr.next_due_at AS nextDueAt, h.id AS horseId, h.name AS horseName, h.tag_number AS tagNumber
     FROM care_records cr
     INNER JOIN horses h ON h.id = cr.horse_id
     WHERE cr.company_id = ? AND cr.next_due_at IS NOT NULL AND cr.next_due_at <= DATE_ADD(CURDATE(), INTERVAL 15 DAY)
     ORDER BY cr.next_due_at ASC`,
    [companyId]
  );

  const today = new Date().toISOString().slice(0, 10);
  return rows.map((item) => ({
    ...item,
    status: item.nextDueAt < today ? "overdue" : "upcoming",
  }));
}
