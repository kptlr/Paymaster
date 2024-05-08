import { Module } from '@nestjs/common';
import { UpdatesHandlerService } from './updates.handler.service';
import { BillModule } from 'src/bill/bill.module';

@Module({
  imports: [BillModule],
  providers: [UpdatesHandlerService],
})
export class BotModule {}
