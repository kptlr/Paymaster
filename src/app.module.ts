import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import botConfig, { IBotConfig } from './config/bot.config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BillModule } from './bill/bill.module';
import { BotModule } from './bot/bot.module';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [botConfig, databaseConfig] }),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<IBotConfig>('bot').token,
      }),
      inject: [ConfigService],
      imports: [ConfigModule, BillModule],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          ...config.get<Partial<TypeOrmModuleAsyncOptions>>('database'),
          type: 'postgres',
          synchronize: false,
          migrationsTableName: 'migrations',
          migrations: ['dist/migrations/*{.ts,.js}'],
          entities: [],
          cli: {
            migrationsDir: 'migrations',
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    BillModule,
    BotModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
