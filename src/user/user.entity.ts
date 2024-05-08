import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int8', { name: 'telegram_id', nullable: false, unique: true })
  telegramId: number;

  @Column('varchar', { name: 'first_name', length: 255, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 255, nullable: true })
  lastName: string;

  @Column('varchar', { name: 'username', length: 255, nullable: true })
  username: string;

  @Column({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;
}
