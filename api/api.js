// api/api.js
import 'dotenv-safe/config.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino-http';
import Redis from 'ioredis';
import { Queue, Job } from 'bullmq';
import { v4 as uuid } from 'uuid';
import basicAuth from 'express-basic-auth';

import { submitSchema } from '../shared/validate.js';
import { asyncWrap } from './asyncWrap.js';

import { ExpressAdapter } from 'bull-board/express';
import { BullMQAdapter } from 'bull-board/bullMQAdapter';
import { createBullBoard } from 'bull-board';

/* ------------------------------------------------------------------ */
/*  Redis & job queue                                                 */
/* ------------------------------------------------------------------ */
const redis = new Redis(process.env.REDIS_URL);
const queue = new Queue('code-jobs', { connection: redis });

/* ------------------------------------------------------------------ */
/*  Express app & core middleware                                     */
/* ------------------------------------------------------------------ */
const app = express();
const log = pino({ transport: { target: 'pino-pretty' } });

app.use(helmet());
// app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS.split(',') }));
app.use(cors({ origin: process.env.CORS_ALLOWED_ORIGINS === '*' ? true : process.env.CORS_ALLOWED_ORIGINS.split(',')}));
app.use(express.json({ limit: '256kb' }));
app.use(rateLimit({
  windowMs: +process.env.RATE_LIMIT_WINDOW_MS,
  max: +process.env.RATE_LIMIT_MAX
}));
app.use(log);

/* ------------------------------------------------------------------ */
/*  Bull Board dashboard (protected)                                  */
/* ------------------------------------------------------------------ */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter
});

const adminUsers = {};
adminUsers[process.env.DASH_USER] = process.env.DASH_PASS;

app.use('/admin/queues', basicAuth({
  users: adminUsers,
  challenge: true
}));
app.use('/admin/queues', serverAdapter.getRouter());

/* ------------------------------------------------------------------ */
/*  Routes                                                            */
/* ------------------------------------------------------------------ */
app.post('/submit-code', asyncWrap(async (req, res) => {
  const { code, language } = submitSchema.parse(req.body);

  const jobId = uuid();
  await queue.add('run', { code, language }, {
    jobId,
    removeOnComplete: 100,
    removeOnFail: 100
  });

  res.status(202).json({ jobId });
}));

app.get('/job/:id', asyncWrap(async (req, res) => {
  const job = await Job.fromId(queue, req.params.id);
  if (!job) return res.status(404).json({ error: 'job not found' });

  const state = await job.getState();                // waiting | active | completed | failed
  res.json({ state, data: job.returnvalue || job.failedReason || null });
}));

/* ------------------------------------------------------------------ */
/*  Central error handler                                             */
/* ------------------------------------------------------------------ */
app.use((err, req, res, next) => {
  req.log.error(err);

  if (err.name === 'ZodError') {                     // validation error from submitSchema
    return res.status(400).json({ error: err.errors });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal error' });
});

/* ------------------------------------------------------------------ */
/*  Start server                                                      */
/* ------------------------------------------------------------------ */
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`API ready on port ${PORT}`)
);
