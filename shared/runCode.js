// shared/runCode.js   (patched)

import fs from 'fs/promises';
import { exec as rawExec } from 'child_process';
import util from 'util';
import path from 'path';

export const exec = util.promisify(rawExec);
export const tempDir = new URL('../tmp/', import.meta.url).pathname;
await fs.mkdir(tempDir, { recursive: true });

/* ---------- ONE helper that injects /usr/bin/time ---------- */
const timer = '/usr/bin/time -f "Execution Time: %e seconds\\nMemory Used: %M KB"';

/* ---------- per‑language command builders ---------- */
export const languageConfigs = {
  cpp: {
    ext: '.cpp',
    cmd: f => `${timer} g++ ${f} -o ${f}.out && ${f}.out`
  },

  python: {
    ext: '.py',
    cmd: f => `${timer} python3 ${f}`
  },

  js: {
    ext: '.js',
    cmd: f => `${timer} node ${f}`
  },

  java: {
    ext: '.java',
    cmd: f => {
      const cls = path.basename(f, '.java');
      // wrap with sh -c so /usr/bin/time measures both compile + run
      return `${timer} sh -c "javac ${f} && java -cp ${tempDir} ${cls}"`;
    }
  }
};

/* ---------- helpers ---------- */
const pick  = (s, r) => (s.match(r) || [])[1] || 'N/A';
const clean = s =>
  s.split('\n')
   .filter(l => !/Execution Time|Memory Used/.test(l))
   .join('\n')
   .trim();

/* ---------- main runner ---------- */
export async function runCode(code, language, jobId) {
  const cfg = languageConfigs[language];
  if (!cfg) throw new Error('Unsupported language');

  const file = path.join(tempDir, `${jobId}${cfg.ext}`);
  await fs.writeFile(file, code);

  const { stdout, stderr } = await exec(cfg.cmd(file), {
    timeout: 10_000,
    maxBuffer: 1_048_576
  });

  log.info({ jobId: job.id, stdout, stderr }); 

  return {
    output: stdout.trim(),
    executionTime: pick(stderr, /Execution Time:\s*(.+?)\s*seconds/),
    memoryUsage:   pick(stderr, /Memory Used:\s*(.+?)\s*KB/)
  };
}
