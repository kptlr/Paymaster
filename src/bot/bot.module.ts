import { Module } from '@nestjs/common';
import { UpdatesHandlerService } from './updates.handler.service';

@Module({
  providers: [UpdatesHandlerService],
})
export class BotModule {}
