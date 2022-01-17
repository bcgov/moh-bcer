import {MigrationInterface, QueryRunner} from "typeorm";


export class ManufacturingDeleteColumn1659534109933 implements MigrationInterface {
    name = 'ManufacturingDeleteColumn1659534109933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manufacturing" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address_id" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."longitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "longitude" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."latitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "latitude" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_confidence" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_confidence" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address_id" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."longitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "longitude" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."latitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "latitude" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_confidence" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_confidence" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_confidence" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_confidence" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "latitude" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."latitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "longitude" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."longitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address_id" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_confidence" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_confidence" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "latitude" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."latitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "longitude" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."longitude" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address_id" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "geo_address" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."geo_address" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "manufacturing" DROP COLUMN "deleted_at"`);
    }

}
