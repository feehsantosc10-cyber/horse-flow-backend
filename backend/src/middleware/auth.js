import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    req.user = verifyToken(header.replace("Bearer ", ""));
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido." });
  }
}
