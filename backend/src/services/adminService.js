import { db } from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

function normalizeRole(role) {
  return role === "admin" ? "admin" : "user";
}

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

function buildPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: Boolean(user.active),
    createdAt: user.created_at,
  };
}

async function ensureUserExists(companyId, userId) {
  const [rows] = await db.query(
    `SELECT id, name, email, role, active, created_at
     FROM users
     WHERE company_id = ? AND id = ?
     LIMIT 1`,
    [companyId, userId]
  );

  if (!rows[0]) {
    const error = new Error("Usuario nao encontrado.");
    error.status = 404;
    throw error;
  }

  return rows[0];
}

export async function listUsers(companyId) {
  const [rows] = await db.query(
    `SELECT id, name, email, role, active, created_at
     FROM users
     WHERE company_id = ?
     ORDER BY created_at DESC, id DESC`,
    [companyId]
  );

  return rows.map(buildPublicUser);
}

export async function createUser(companyId, payload) {
  const normalizedEmail = normalizeEmail(payload.email);
  const name = payload.name?.trim();
  const password = payload.password?.trim();
  const role = normalizeRole(payload.role);

  if (!name || !normalizedEmail || !password) {
    const error = new Error("Nome, e-mail e senha sao obrigatorios.");
    error.status = 400;
    throw error;
  }

  const [existing] = await db.query("SELECT id FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);
  if (existing.length) {
    const error = new Error("Ja existe usuario com este e-mail.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const [result] = await db.query(
    `INSERT INTO users (company_id, name, email, password_hash, role, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [companyId, name, normalizedEmail, passwordHash, role, 1]
  );

  return buildPublicUser(await ensureUserExists(companyId, result.insertId));
}

export async function updateUser(companyId, userId, payload, currentUserId) {
  const existingUser = await ensureUserExists(companyId, userId);
  const normalizedEmail = normalizeEmail(payload.email);
  const name = payload.name?.trim();
  const role = normalizeRole(payload.role);

  if (!name || !normalizedEmail) {
    const error = new Error("Nome e e-mail sao obrigatorios.");
    error.status = 400;
    throw error;
  }

  const [duplicate] = await db.query("SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1", [normalizedEmail, userId]);
  if (duplicate.length) {
    const error = new Error("Ja existe usuario com este e-mail.");
    error.status = 409;
    throw error;
  }

  if (Number(existingUser.id) === Number(currentUserId) && role !== "admin") {
    const error = new Error("O admin atual nao pode remover o proprio perfil de admin.");
    error.status = 400;
    throw error;
  }

  if (payload.password?.trim()) {
    const passwordHash = await hashPassword(payload.password.trim());
    await db.query(
      `UPDATE users
       SET name = ?, email = ?, role = ?, password_hash = ?
       WHERE company_id = ? AND id = ?`,
      [name, normalizedEmail, role, passwordHash, companyId, userId]
    );
  } else {
    await db.query(
      `UPDATE users
       SET name = ?, email = ?, role = ?
       WHERE company_id = ? AND id = ?`,
      [name, normalizedEmail, role, companyId, userId]
    );
  }

  return buildPublicUser(await ensureUserExists(companyId, userId));
}

export async function updateUserStatus(companyId, userId, payload, currentUserId) {
  const user = await ensureUserExists(companyId, userId);
  const active = Boolean(payload.active);

  if (Number(user.id) === Number(currentUserId) && !active) {
    const error = new Error("Voce nao pode desativar o proprio usuario.");
    error.status = 400;
    throw error;
  }

  await db.query("UPDATE users SET active = ? WHERE company_id = ? AND id = ?", [active ? 1 : 0, companyId, userId]);

  return buildPublicUser(await ensureUserExists(companyId, userId));
}
