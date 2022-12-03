import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUpcProductSold1657170607277 implements MigrationInterface {
    name = 'UpdateUpcProductSold1657170607277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "product_sold"."upc" IS NULL`);
        await queryRunner.query(`ALTER TABLE "product_sold" DROP CONSTRAINT "UQ_9b83599a9b9049d48be7ffaab45"`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "product_sold" ADD CONSTRAINT "UQ_9b83599a9b9049d48be7ffaab45" UNIQUE ("upc")`);
        await queryRunner.query(`COMMENT ON COLUMN "product_sold"."upc" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
    }

}
