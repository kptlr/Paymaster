import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePositionsTable20240508211047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS public.positions (
				id bigserial NOT NULL,
				bill_id int8 NOT NULL references bills(id),
				name varchar(255) NULL,
				price real NULL,
				created_at timestamp(0) NULL,
				updated_at timestamp(0) NULL,
				CONSTRAINT positions_pkey PRIMARY KEY (id)
			);
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
