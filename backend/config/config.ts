import {
  struct,
  literal,
  union,
  string,
  OutputOf,
  numberField,
} from '@monoid-dev/reform';

export const configSchema = struct({
  NODE_ENV: union([literal('development'), literal('production')]),
  PG_HOST: string(),
  PG_PORT: string(),
  PG_USERNAME: string(),
  PG_PASSWORD: string(),
  PG_DATABASE: string(),

  APP_SECRET: string(),
  PORT: numberField(),

  AWS_REGION: string(),
  AWS_S3_BUCKET: string(),
  AWS_KEY_ID: string(),
  AWS_SECRET_ACCESS_KEY: string(),

  STATIC_PATH: string(),
  GOOGLE_APIKEY: string(),
  MASTER_PASSWORD: string(),
});

export type Config = OutputOf<typeof configSchema>;

export const config = () => {
  const e = configSchema.resolve(process.env as any);
  if (e._tag === 'left') throw new Error(JSON.stringify(e.left, undefined, 2));

  return e.right;
};
