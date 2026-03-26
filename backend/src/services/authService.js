import { db } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";

const defaultAlertSettings = [
  ["shoeing", 45],
  ["dentistry", 240],
  ["vaccine", 180],
  ["deworming", 90],
];

export async function registerCompanyAccount(payload) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const normalizedEmail = payload.email?.trim().toLowerCase();
    const companyName = payload.companyName?.trim();

    if (!companyName || !normalizedEmail || !payload.password) {
      const error = new Error("Nome do local, e-mail e senha sao obrigatorios.");
      error.status = 400;
      throw error;
    }

    const [existing] = await connection.query("SELECT id FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);
    if (existing.length) {
      const error = new Error("Ja existe usuario com este e-mail.");
      error.status = 409;
      throw error;
    }

    const [companyResult] = await connection.query(
      `INSERT INTO companies (name, legal_name, document, email, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [companyName, null, null, normalizedEmail, null]
    );

    const passwordHash = await hashPassword(payload.password);

    const [userResult] = await connection.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'owner')`,
      [companyResult.insertId, companyName, normalizedEmail, passwordHash]
    );

    for (const [careType, intervalDays] of defaultAlertSettings) {
      await connection.query(
        `INSERT INTO alert_settings (company_id, care_type, interval_days, enabled)
         VALUES (?, ?, ?, 1)`,
        [companyResult.insertId, careType, intervalDays]
      );
    }

    await connection.commit();

    return buildAuthResponse({
      token: signToken({ userId: userResult.insertId, companyId: companyResult.insertId, role: "owner" }),
      user: { id: userResult.insertId, name: companyName, email: normalizedEmail, role: "owner" },
      company: { id: companyResult.insertId, name: companyName, email: normalizedEmail },
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function login(payload) {
  const [rows] = await db.query(
    `SELECT u.id, u.company_id, u.name, u.email, u.password_hash, u.role, c.name AS company_name, c.email AS company_email
     FROM users u
     INNER JOIN companies c ON c.id = u.company_id
     WHERE u.email = ? AND u.active = 1
     LIMIT 1`,
    [payload.email]
  );

  const user = rows[0];
  if (!user || !(await comparePassword(payload.password, user.password_hash))) {
    const error = new Error("Credenciais invalidas.");
    error.status = 401;
    throw error;
  }

  return buildAuthResponse({
    token: signToken({ userId: user.id, companyId: user.company_id, role: user.role }),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    company: { id: user.company_id, name: user.company_name, email: user.company_email },
  });
}

export async function getAuthenticatedProfile(userId) {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.role, c.id AS company_id, c.name AS company_name, c.email AS company_email
     FROM users u
     INNER JOIN companies c ON c.id = u.company_id
     WHERE u.id = ?
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

function buildAuthResponse(payload) {
  return payload;
}
