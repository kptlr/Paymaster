import { Command, Ctx, Update, Sender, On, Message } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '../common/decorators/update-type.decorator';
import { Context, Markup } from 'telegraf';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { TelegrafExceptionFilter } from 'src/common/filters/telegraf-exception.filter';
import {
  ADD_POSITION_ERROR,
  BILL_CLOSED,
  BILL_NOT_OPENED_ERROR,
  GREETING_TEXT,
  INCORRECT_POSITION_FORMAT,
  NEW_BILL_ERROR,
  NEW_BILL_TEXT,
} from './bot.const';
import { BillService } from 'src/bill/bill.service';
import { PositionDto } from 'src/bill/position.dto';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class UpdatesHandlerService {
  @Inject() billService: BillService;
  //@Start()
  @Command('start')
  async start(@Ctx() ctx: Context): Promise<void> {
    await ctx.replyWithMarkdownV2(GREETING_TEXT);
  }

  @Command('help')
  async help(@Ctx() ctx: Context): Promise<void> {
    await ctx.replyWithMarkdownV2(GREETING_TEXT);
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  async admin(@Ctx() ctx: Context): Promise<void> {
    await ctx.sendMessage('Админский доступ есть');
  }

  @On('sticker')
  async logSticker(@Ctx() ctx: Context): Promise<void> {
    console.log(ctx.message);
  }

  // @Command('test')
  // async log(@Ctx() ctx: Context): Promise<void> {
  //   ctx.reply(
  //     'One Hi',
  //     Markup.keyboard([
  //       [
  //         'Новый счет',
  //         'Посчитать',
  //         'Предварительный расчет',
  //         'Добавить к счету чаевые',
  //       ],
  //     ]),
  //   );
  // }

  //@Hears(['Новый счет'])
  @Command('new')
  newBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') id: number,
  ): string {
    if (this.billService.hasOpenedBill(id)) {
      return NEW_BILL_ERROR;
    }
    this.billService.createBill(id);
    return NEW_BILL_TEXT;
  }

  @Command('bill')
  closeBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') id: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    if (!this.billService.hasOpenedBill(id)) {
      ctx.reply(BILL_NOT_OPENED_ERROR);
      return;
    }
    //todo Генерим счет
    ctx.reply(this.billService.closeBill(id));
    ctx.reply(BILL_CLOSED);
  }

  @Command('pre_bill')
  preBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') id: number,
  ): string {
    if (!this.billService.hasOpenedBill(id)) {
      return BILL_NOT_OPENED_ERROR;
    }
    return `${this.billService.calcBill(id)}`;
  }

  @On('message')
  async addPosition(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') id: number,
    @Message('text') text: string,
    @Ctx() ctx: Context,
  ): Promise<void> {
    if (!this.billService.hasOpenedBill(id)) {
      ctx.reply(ADD_POSITION_ERROR);
      return;
    }
    try {
      const position = PositionDto.from(text);
      this.billService.addPosition(id, position);
      ctx.replyWithHTML(
        `👌 Запись добавлена. \n 💰 Общий счет составляет <b>${this.billService.calcCurrentBillAmount(id)}</b> денег`,
      );
    } catch (error) {
      ctx.replyWithMarkdownV2(INCORRECT_POSITION_FORMAT);
    }
  }
}
