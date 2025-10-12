import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { config } from './Config/env.js';
import './Config/passport.js';
import authRoutes from './Routes/auth.js';
import apiRoutes from './Routes/api.js';

const app = express();

app.get("/index.html", (req, res) => {
  res.redirect("http://localhost:5501/Frontend/main.html");
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// tiny rate limiter
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 120
}));

app.use(cors({
  origin: config.frontendOrigin,
  credentials: true
}));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// healthcheck
app.get('/', (req, res) => res.send('Backend running'));

app.listen(config.port, () => console.log(`Server listening on http://localhost:${config.port}`));
