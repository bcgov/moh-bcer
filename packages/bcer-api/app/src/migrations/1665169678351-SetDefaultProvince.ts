import {MigrationInterface, QueryRunner} from "typeorm";

export class SetDefaultProvince1665169678351 implements MigrationInterface {
    name = 'SetDefaultProvince1665169678351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "business" SET province = 'BC' WHERE "province" IS NULL`);
        await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "province" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "province" DROP NOT NULL`);
    }

}
