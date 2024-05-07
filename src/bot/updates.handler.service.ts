import {
  Command,
  Ctx,
  Hears,
  Start,
  Update,
  Sender,
  On,
} from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '../common/decorators/update-type.decorator';
import { Context, Markup } from 'telegraf';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import { GREETING_TEXT } from './bot.const';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class UpdatesHandlerService {
  @Start()
  onStart(): string {
    return GREETING_TEXT;
  }

  //todo Попробовать сделать

  @Command('admin')
  @UseGuards(AdminGuard)
  async admin(@Ctx() ctx: Context): Promise<void> {
    await ctx.sendMessage('Админский доступ есть');
  }

  @On('sticker')
  async logSticker(@Ctx() ctx: Context): Promise<void> {
    console.log(ctx.message);
  }

  @Command('test')
  async log(@Ctx() ctx: Context): Promise<void> {
    ctx.reply(
      'One Hi',
      Markup.keyboard([
        [
          'Новый счет',
          'Посчитать',
          'Предварительный расчет',
          'Добавить к счету чаевые',
        ],
      ]),
    );
  }

  @Hears(['Новый счет'])
  @Command('new')
  newBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') id: number,
  ): string {
    return `Создаю счет для ${firstName}, ${lastName}, ${id}, ${username} `;
  }

  @Command('help')
  async help(@Ctx() ctx: Context): Promise<void> {
    await ctx.sendMessage(GREETING_TEXT);
  }

  // @Hears(['hi', 'hello', 'hey', 'qq'])
  // onGreetings(
  //   @UpdateType() updateType: TelegrafUpdateType,
  //   @Sender('first_name') firstName: string,
  // ): string {
  //   return `Hey ${firstName}`;
  // }
}
