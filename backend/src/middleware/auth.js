import { db } from "../config/db.js";
import { verifyToken } from "../utils/jwt.js";

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    const payload = verifyToken(header.replace("Bearer ", ""));
    const [rows] = await db.query(
      `SELECT id, company_id, name, email, role, active
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [payload.userId]
    );

    const user = rows[0];
    if (!user || !user.active) {
      return res.status(401).json({ message: "Usuario inativo ou inexistente." });
    }

    req.user = {
      userId: user.id,
      companyId: user.company_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acesso permitido apenas para admin." });
  }

  return next();
}
