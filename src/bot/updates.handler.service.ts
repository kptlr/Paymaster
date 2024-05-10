import { Command, Ctx, Update, Sender, On, Message } from 'nestjs-telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';
import { UpdateType } from '../common/decorators/update-type.decorator';
import { Context } from 'telegraf';
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
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/user.create.dto';
import { ChatId } from 'src/common/decorators/chat-id.decorator';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class UpdatesHandlerService {
  @Inject() private readonly billService: BillService;
  @Inject() private readonly userService: UserService;

  private epifan: string[] = [
    'CAACAgIAAxkBAAM_ZjqWt73vAu1_XBNs2nmobUB8X50AAvYAA0C9tgZXvT8OeLBq4DUE',
    'CAACAgIAAxkBAANAZjqW1ZatUr7rMwTEBMmr7w_gzEIAAvUAA0C9tgY67925SJpPgDUE',
  ];

  @Command(['start', 'help'])
  async start(
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @ChatId() chatId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    await ctx.replyWithMarkdownV2(GREETING_TEXT);
  }

  //@Hears(['Новый счет'])
  @Command('new')
  async newBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @ChatId() chatId: number,
  ): Promise<string> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );

    if (await this.billService.hasOpenedBill(chatId)) {
      return NEW_BILL_ERROR;
    }

    await this.billService.createBill(user.id, chatId);
    return NEW_BILL_TEXT;
  }

  @Command('bill')
  async closeBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @ChatId() chatId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    if (!(await this.billService.hasOpenedBill(chatId))) {
      ctx.reply(BILL_NOT_OPENED_ERROR);
      return;
    }
    ctx.replyWithHTML(await this.billService.closeBill(chatId, user));
    ctx.reply(BILL_CLOSED);
  }

  @Command('pre_bill')
  async preBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @ChatId() chatId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    if (!(await this.billService.hasOpenedBill(chatId))) {
      ctx.reply(BILL_NOT_OPENED_ERROR);
      return;
    }
    await ctx.replyWithHTML(`${await this.billService.calcBill(chatId, user)}`);
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  async admin(
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    const userCount = await this.userService.getUsersCount();
    const billCount = await this.billService.getBillsCount();
    await ctx.replyWithHTML(
      `Количество пользователей в системе: <b>${userCount}</b> \nКоличество счетов в системе: <b>${billCount}</b>`,
    );
  }

  // @On('sticker')
  // async logSticker(
  //   @Sender('first_name') firstName: string,
  //   @Sender('last_name') lastName: string,
  //   @Sender('username') username: string,
  //   @Sender('id') telegramId: number,
  //   @Ctx() ctx: Context,
  // ): Promise<void> {
  //   console.log(ctx.message);
  // }

  @On('message')
  async addPosition(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @Message('text') text: string,
    @ChatId() chatId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    if (!(await this.billService.hasOpenedBill(chatId))) {
      ctx.reply(ADD_POSITION_ERROR);
      return;
    }
    try {
      const position = PositionDto.from(text);

      const stickerId = Math.floor(Math.random() * this.epifan.length);
      await ctx.replyWithSticker(this.epifan[stickerId]);

      ctx.replyWithHTML(
        await this.billService.addPosition(chatId, user, position),
      );
    } catch (error) {
      ctx.replyWithMarkdownV2(INCORRECT_POSITION_FORMAT);
    }
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
}
