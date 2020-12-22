import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableProducts1601584514826 implements MigrationInterface {
    name = 'NullableProducts1601584514826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "brandName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "productName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerAddress" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerPhone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerEmail" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerContact" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "concentration" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "containerCapacity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cartridgeCapacity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "ingredients" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "flavour" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "flavour" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "ingredients" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cartridgeCapacity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "containerCapacity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "concentration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerContact" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerEmail" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerPhone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerAddress" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "manufacturerName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "productName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "brandName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "type" SET NOT NULL`);
    }

}
