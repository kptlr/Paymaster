import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { Position } from './position.entity';
import { Bill } from './bill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Position, User]), UserModule],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
