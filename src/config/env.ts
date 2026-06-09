import {config} from 'dotenv';
import {z} from 'zod'
import { STAGES } from './stages';
import { DialectAdapterBase } from 'kysely';

config();

const envSchema = z.object({
  APP_PORT:z.coerce.number().default(3000),
  STAGE: z.nativeEnum(STAGES).default(STAGES.Local),
  DATABASE_URL: z.string(),
})

export const envConfig = envSchema.parse({
  APP_PORT: process.env.APP_PORT,
  STAGE: process.env.STAGE,
  DATABASE_URL: process.env.DATABASE_URL,
})

export type EnvConfig = z.infer<typeof envSchema>;