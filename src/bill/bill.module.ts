import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { Position } from './position.entity';
import { Bill } from './bill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { BillMapper } from './bill.mapper';
import { BillCalculator } from './bill-calculator';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Position, User]), UserModule],
  providers: [BillService, BillMapper, BillCalculator],
  exports: [BillService],
})
export class BillModule {}
