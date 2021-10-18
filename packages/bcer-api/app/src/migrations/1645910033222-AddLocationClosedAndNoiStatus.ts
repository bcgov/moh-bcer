import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationClosedAndNoiStatus1645910033222
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE noi_status_enum AS ENUM ('submitted', 'not_renewed')`);
    await queryRunner.query(`ALTER TABLE "location" ADD COLUMN "closed" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "noi" ADD COLUMN "status" noi_status_enum NOT NULL DEFAULT('submitted')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> { 
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "closed"`);
    await queryRunner.query(`ALTER TABLE "noi" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE IF EXISTS noi_status_enum`);
  }
}
