import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Catch()
export class TelegrafExceptionFilter implements ExceptionFilter {
  private stickers: string[] = [
    'CAACAgIAAxkBAAM_ZjqWt73vAu1_XBNs2nmobUB8X50AAvYAA0C9tgZXvT8OeLBq4DUE',
    'CAACAgIAAxkBAANAZjqW1ZatUr7rMwTEBMmr7w_gzEIAAvUAA0C9tgY67925SJpPgDUE',
  ];

  /**
   * В случае ошибки возвращает пользователю случайный стикер
   */
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();
    const stickerId = Math.floor(Math.random() * this.stickers.length);

    console.error(exception);

    await ctx.replyWithSticker(this.stickers[stickerId]);
  }
}
