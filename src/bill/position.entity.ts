import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('positions')
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int8', { name: 'bill_id', nullable: false })
  billId: number;

  @Column('varchar', { name: 'name', length: 255, nullable: false })
  name: string;

  @Column('real', { name: 'price', nullable: false })
  price: number;

  @Column('int8', { name: 'user_id', nullable: false })
  userId: number;

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
