import { db } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";

const setupAdminUser = {
  name: "Felipe",
  email: "feehsantosc10@gmail.com",
  password: "Felipe@2004",
};

export async function getRegisterDisabledResponse() {
  return { message: "Cadastro desativado" };
}

export async function createInitialAdmin() {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUsers] = await connection.query(
      `SELECT id, company_id, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [setupAdminUser.email]
    );

    const existingUser = existingUsers[0];

    if (existingUser?.role === "admin") {
      await connection.commit();
      return { message: "Admin ja existe" };
    }

    let companyId = existingUser?.company_id;

    if (!companyId) {
      const [companies] = await connection.query(
        `SELECT id
         FROM companies
         ORDER BY id ASC
         LIMIT 1`
      );

      if (companies[0]) {
        companyId = companies[0].id;
      } else {
        const [companyResult] = await connection.query(
          `INSERT INTO companies (name, legal_name, document, email, phone)
           VALUES (?, ?, ?, ?, ?)`,
          ["Horse Flow Admin", null, null, setupAdminUser.email, null]
        );

        companyId = companyResult.insertId;
      }
    }

    const passwordHash = await hashPassword(setupAdminUser.password);

    if (existingUser) {
      await connection.query(
        `UPDATE users
         SET name = ?, password_hash = ?, role = 'admin', active = 1
         WHERE id = ?`,
        [setupAdminUser.name, passwordHash, existingUser.id]
      );
    } else {
      await connection.query(
        `INSERT INTO users (company_id, name, email, password_hash, role, active)
         VALUES (?, ?, ?, ?, 'admin', 1)`,
        [companyId, setupAdminUser.name, setupAdminUser.email, passwordHash]
      );
    }

    await connection.commit();
    return { message: "Admin criado com sucesso" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
