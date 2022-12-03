import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSalesReportColumnNull1635800033222
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "salesreport" ALTER COLUMN "containers" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "salesreport" ALTER COLUMN "cartridges" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> { 
    await queryRunner.query(`ALTER TABLE "salesreport" ALTER COLUMN "containers" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "salesreport" ALTER COLUMN "cartridges" SET NOT NULL`);
  }
}
