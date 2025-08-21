import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;

  const token =
    cookieToken ||
    (authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "Autorizacion denegada por token." });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido." });
    }
    req.user = user;
    next();
  });
};
