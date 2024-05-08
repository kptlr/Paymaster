import { registerAs } from '@nestjs/config';

export default registerAs<IDatabaseConfig>('database', () => ({
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsRun: process.env.DB_MIGRATIONS === 'true',
}));

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  migrationsRun: boolean;
}
