import { registerAs } from '@nestjs/config';

export default registerAs<IDatabaseConfig>('database', () => ({
  host: process.env.FILE_DB_HOST,
  port: Number.parseInt(process.env.FILE_DB_PORT) || 5432,
  username: process.env.FILE_DB_USERNAME,
  password: process.env.FILE_DB_PASSWORD,
  database: process.env.FILE_DB_DATABASE,
  migrationsRun: process.env.FILE_DB_MIGRATIONS === 'true',
}));

export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  migrationsRun: boolean;
}
