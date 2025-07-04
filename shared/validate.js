import { z } from 'zod';
export const submitSchema = z.object({
  code: z.string().min(1).max(100_000),         // 100 kB safety
  language: z.enum(['cpp', 'python', 'js', 'java'])
});
