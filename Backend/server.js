import express from 'express';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './Routes/auth.js';
import apiRoutes from './Routes/api.js';
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './Config/env.js';
import './Config/passport.js';

const app = express();

console.log('[CONFIG] google config:', config.google);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));
app.use(cors({ origin: 'https://turing-web-version.vercel.app', credentials: true }));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// healthcheck
app.get('/', (req, res) => res.send('Backend running'));


const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
