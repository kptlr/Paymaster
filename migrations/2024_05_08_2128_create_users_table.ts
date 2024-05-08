import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable20240508191047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS public.users (
				id bigserial NOT NULL,
				telegram_id int8 NOT NULL UNIQUE,
				"first_name" varchar(255) NULL,
				"last_name" varchar(255) NULL,
				"username" varchar(255) NULL,
				created_at timestamp(0) NULL,
				CONSTRAINT users_pkey PRIMARY KEY (id)
			);
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
