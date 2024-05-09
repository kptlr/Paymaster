import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Injectable()
export class AdminGuard implements CanActivate {
  //fixme Переделать на инжект через Config Service
  private readonly ADMIN_IDS = process.env.ADMINS.split(',').map(
    (id) => Number.parseInt(id) | 0,
  );

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isAdmin = this.ADMIN_IDS.includes(from.id);
    if (!isAdmin) {
      throw new TelegrafException('You are not admin 😡');
    }

    return true;
  }
}
