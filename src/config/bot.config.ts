import { registerAs } from '@nestjs/config';

export default registerAs<IBotConfig>('bot', () => ({
  token: process.env.BOT_TOKEN,
}));

export interface IBotConfig {
  token: string;
}
