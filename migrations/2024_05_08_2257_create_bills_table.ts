import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillsTable20240508201047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS public.bills (
				id bigserial NOT NULL,
				user_id int8 NOT NULL references users(id),
				state varchar(20) NOT NULL,
				tips smallint NULL, 
				created_at timestamp(0) NULL,
				updated_at timestamp(0) NULL,
				CONSTRAINT bills_pkey PRIMARY KEY (id)
			);
		`);

    await queryRunner.query(`
			CREATE INDEX state_idx ON public.bills(state);
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
