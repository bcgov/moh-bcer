import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSalesReportProductIdNull1631690033381
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE salesreport ADD COLUMN "productSoldId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE salesreport
            ADD CONSTRAINT "FK_f50e36ee6f559dfb4e5470075d8" FOREIGN KEY ("productSoldId")
            REFERENCES public.product_sold (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE salesreport
            DROP CONSTRAINT "FK_f50e36ee6f559dfb4e5470075d8"
        `);
    await queryRunner.query(
      `ALTER TABLE salesreport DROP COLUMN productSoldId`,
    );
  }
}
