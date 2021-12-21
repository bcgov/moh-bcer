import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGeoCodeInLocation1659509996219 implements MigrationInterface {
    name = 'AddGeoCodeInLocation1659509996219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "geo_address" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "location" ADD "geo_address_id" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "location" ADD "longitude" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "location" ADD "latitude" character varying DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "location" ADD "geo_confidence" character varying DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
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
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_time" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_time" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "closed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."closed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "geo_confidence"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "geo_address_id"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "geo_address"`);
    }

}
