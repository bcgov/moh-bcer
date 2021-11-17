import {MigrationInterface, QueryRunner} from "typeorm";

export class HealthAuthority1637133650647 implements MigrationInterface {
    name = 'HealthAuthority1637133650647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "health_authority_other" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" SET DEFAULT null`);
        await queryRunner.query(`ALTER TYPE "public"."location_health_authority_enum" RENAME TO "location_health_authority_enum_old"`);
        await queryRunner.query(`CREATE TYPE "location_health_authority_enum" AS ENUM('coastal', 'fraser', 'interior', 'island', 'northern', 'other')`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "health_authority" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "health_authority" TYPE "location_health_authority_enum" USING "health_authority"::"text"::"location_health_authority_enum"`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "health_authority" SET DEFAULT 'island'`);
        await queryRunner.query(`DROP TYPE "location_health_authority_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "location"."health_authority" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "location"."health_authority" IS NULL`);
        await queryRunner.query(`CREATE TYPE "location_health_authority_enum_old" AS ENUM('fraser', 'interior', 'island', 'northern', 'coastal')`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "health_authority" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "health_authority" TYPE "location_health_authority_enum_old" USING "health_authority"::"text"::"location_health_authority_enum_old"`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "health_authority" SET DEFAULT 'island'`);
        await queryRunner.query(`DROP TYPE "location_health_authority_enum"`);
        await queryRunner.query(`ALTER TYPE "location_health_authority_enum_old" RENAME TO  "location_health_authority_enum"`);
        await queryRunner.query(`ALTER TABLE "noi" ALTER COLUMN "renewed_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "noi"."renewed_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "health_authority_other"`);
    }

}
