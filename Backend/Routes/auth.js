import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { config } from '../Config/env.js';
const router = express.Router();

// start OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${config.frontendOrigin}/Frontend/login.html`, session: false }),
  async (req, res) => {
    const profile = req.user;
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    const id = profile.id;

    await db.read();
    let user = db.data.users.find(u => u.googleId === id || u.email === email);
    if (!user) {
      user = {
        id: `u_${Date.now()}`,
        googleId: id,
        displayName: profile.displayName,
        email,
        photo: profile.photos && profile.photos[0] && profile.photos[0].value,
        createdAt: new Date().toISOString()
      };
      db.data.users.push(user);
      await db.write();
    } else {
      user.displayName = profile.displayName;
      user.photo = profile.photos && profile.photos[0] && profile.photos[0].value;
      await db.write();
    }

    // create JWT
    const payload = { sub: user.id, name: user.displayName, email: user.email };
    const token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

    res.cookie('token', token, {
      httpOnly: true,
      secure: (process.env.NODE_ENV === 'production'),
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    // redirect to frontend
    res.redirect(`http://localhost:5501/Frontend/main.html`);
  }
);

// logout endpoint to clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: (process.env.NODE_ENV === 'production') });
  res.json({ ok: true });
});

export default router;
