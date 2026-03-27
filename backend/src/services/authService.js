import { db } from "../config/db.js";
import { comparePassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";

export async function getRegisterDisabledResponse() {
  return { message: "Cadastro desativado" };
}

export async function login(payload) {
  const [rows] = await db.query(
    `SELECT u.id, u.company_id, u.name, u.email, u.password_hash, u.role, u.active, c.name AS company_name, c.email AS company_email
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
    user: { id: user.id, name: user.name, email: user.email, role: user.role, active: Boolean(user.active) },
    company: { id: user.company_id, name: user.company_name, email: user.company_email },
  });
}

export async function getAuthenticatedProfile(userId) {
  const [rows] = await db.query(
    `SELECT u.id, u.name, u.email, u.role, u.active, c.id AS company_id, c.name AS company_name, c.email AS company_email
     FROM users u
     INNER JOIN companies c ON c.id = u.company_id
     WHERE u.id = ? AND u.active = 1
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

function buildAuthResponse(payload) {
  return payload;
}
