import jwt from 'jsonwebtoken';
import { config } from '../Config/env.js';
import db from '../db.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ error: 'Unauthenticated' });

    const decoded = jwt.verify(token, config.jwt.secret);
    await db.read();
    const user = db.data.users.find(u => u.id === decoded.sub);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
}
