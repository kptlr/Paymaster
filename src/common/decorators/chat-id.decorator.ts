import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const ChatId = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    TelegrafExecutionContext.create(ctx).getContext().chat.id,
);
