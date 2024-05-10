import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  /**
   * В случае ошибки возвращает пользователю случайный стикер
   */
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    console.error(exception);

    await ctx.replyWithSticker(
      'CAACAgIAAxkBAAIGYWY9Y8VfZR3DT7PoowKOhxp5fU2SAAINAwACEzmPEWPVqCB_X-3SNQQ',
    );
  }
}
