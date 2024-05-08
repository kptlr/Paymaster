import { Module } from '@nestjs/common';
import { UpdatesHandlerService } from './updates.handler.service';
import { BillModule } from 'src/bill/bill.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [BillModule, UserModule],
  providers: [UpdatesHandlerService],
})
export class BotModule {}
