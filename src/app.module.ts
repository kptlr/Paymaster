import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import botConfig, { IBotConfig } from './config/bot.config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BillModule } from './bill/bill.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [botConfig] }),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<IBotConfig>('bot').token,
      }),
      inject: [ConfigService],
      imports: [ConfigModule, BillModule],
    }),
    BillModule,
    BotModule,
  ],
  providers: [],
})
export class AppModule {}
