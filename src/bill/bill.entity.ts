import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BillState } from './state.enum';

@Entity('bills')
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int8', { name: 'user_id', nullable: false })
  userId: number;

  @Column('varchar', { name: 'state', length: 20, nullable: false })
  state: BillState;

  @Column('smallint', { name: 'tips', nullable: false })
  tips: number;

  @Column({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;
}
