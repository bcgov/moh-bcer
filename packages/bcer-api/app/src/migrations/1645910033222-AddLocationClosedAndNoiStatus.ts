import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationClosedAndNoiStatus1645910033222
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE location_status_enum AS ENUM ('active', 'closed', 'deleted')`);
    await queryRunner.query(`ALTER TABLE "location" ADD COLUMN "status" location_status_enum NOT NULL DEFAULT 'active'`);
    await queryRunner.query(`ALTER TABLE "location" ADD COLUMN "closed_at" timestamp without time zone DEFAULT NULL`);
    await queryRunner.query(`ALTER TABLE "noi" ADD COLUMN "renewed_at" timestamp without time zone DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> { 
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "closed_at"`);
    await queryRunner.query(`ALTER TABLE "noi" DROP COLUMN "renewed_at`);
    await queryRunner.query(`DROP TYPE IF EXISTS location_status_enum`);
  }
}
