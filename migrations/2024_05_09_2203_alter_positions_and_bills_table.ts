import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPositionsAndBillsTableAddColumnUserIdAndChatId20240509220447
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.positions
            ADD user_id int8 NOT NULL DEFAULT -1 references users(id);

            ALTER TABLE public.bills
            ADD chat_id int8 NOT NULL DEFAULT -1;

            CREATE INDEX chat_id_idx ON public.bills(chat_id);
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
