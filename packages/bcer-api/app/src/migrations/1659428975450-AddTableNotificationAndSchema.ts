import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTableNotificationAndSchema1659428975450 implements MigrationInterface {
    name = 'AddTableNotificationAndSchema1659428975450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "phone_number_1" character varying DEFAULT null, "phone_number_2" character varying DEFAULT null, "confirmed" boolean DEFAULT true, "businessId" uuid NOT NULL, CONSTRAINT "REL_d4e12b2c1cec5ee469945e40ab" UNIQUE ("businessId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender" character varying(255), "title" character varying(64), "message" character varying(650) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "completed" boolean NOT NULL DEFAULT false, "success" integer, "fail" integer, "error_data" json DEFAULT null, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_d4e12b2c1cec5ee469945e40ab3" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_d4e12b2c1cec5ee469945e40ab3"`);
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
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
    }

}
