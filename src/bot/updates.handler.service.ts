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

@Update()
@UseFilters(TelegrafExceptionFilter)
export class UpdatesHandlerService {
  @Inject() private readonly billService: BillService;
  @Inject() private readonly userService: UserService;

  @Command(['start', 'help'])
  async start(
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
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
  ): Promise<string> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );

    if (await this.billService.hasOpenedBill(user.id)) {
      return NEW_BILL_ERROR;
    }

    await this.billService.createBill(user.id);
    return NEW_BILL_TEXT;
  }

  @Command('bill')
  async closeBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    if (!(await this.billService.hasOpenedBill(user.id))) {
      ctx.reply(BILL_NOT_OPENED_ERROR);
      return;
    }
    ctx.reply(await this.billService.closeBill(user.id));
    ctx.reply(BILL_CLOSED);
  }

  @Command('pre_bill')
  async preBill(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
  ): Promise<string> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    if (!(await this.billService.hasOpenedBill(user.id))) {
      return BILL_NOT_OPENED_ERROR;
    }
    return `${await this.billService.calcBill(user.id)}`;
  }

  @On('message')
  async addPosition(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @Message('text') text: string,
    @Ctx() ctx: Context,
  ): Promise<void> {
    const user = await this.userService.getOrCreateUserByTgId(
      new UserDto(telegramId, firstName, lastName, username),
    );
    if (!(await this.billService.hasOpenedBill(user.id))) {
      ctx.reply(ADD_POSITION_ERROR);
      return;
    }
    try {
      const position = PositionDto.from(text);
      await this.billService.addPosition(user.id, position);
      ctx.replyWithHTML(
        `👌 Запись добавлена. \n 💰 Общий счет составляет <b>${await this.billService.calcCurrentBillAmount(user.id)}</b> денег`,
      );
    } catch (error) {
      ctx.replyWithMarkdownV2(INCORRECT_POSITION_FORMAT);
    }
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
    await ctx.sendMessage('Админский доступ есть');
  }

  @On('sticker')
  async logSticker(
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
    @Sender('username') username: string,
    @Sender('id') telegramId: number,
    @Ctx() ctx: Context,
  ): Promise<void> {
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
}
