import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeBusinessProvinceNullable1667407731208 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "province" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "province" SET NOT NULL`);
    }

}
