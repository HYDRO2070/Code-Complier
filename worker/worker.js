import 'dotenv/config';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import pino from 'pino';
import { runCode } from '../shared/runCode.js';

const log = pino();
const redis = new Redis(process.env.REDIS_URL);

new Worker(
  'code-jobs',
  async job => {
    try {
      return await runCode(job.data.code, job.data.language, job.id);
    } catch (err) {
      log.error({ jobId: job.id, err });
      throw err;                              // BullMQ marks job failed
    }
  },
  {
    connection: redis,
    concurrency: 2,                           // 2 jobs in parallel
    limiter: { max: 2, duration: 1000 }       // simple back‑pressure
  }
);

log.info('Worker online');
