import {MigrationInterface, QueryRunner} from "typeorm";

export class DoingBusinessAs1608236921062 implements MigrationInterface {
    name = 'DoingBusinessAs1608236921062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "salesreport" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "containers" character varying NOT NULL, "cartridges" character varying NOT NULL, "year" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productId" uuid, "locationId" uuid, CONSTRAINT "PK_d11db0bce115356912b23b45009" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location" ADD "doingBusinessAs" character varying`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_14b2f80fd7140b837b205610ac1"`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "businessId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "salesreport" ADD CONSTRAINT "FK_c33bbe589e43785348d38d1312c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "salesreport" ADD CONSTRAINT "FK_3c409832dd31e20eb1fe92fb656" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_14b2f80fd7140b837b205610ac1" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_14b2f80fd7140b837b205610ac1"`);
        await queryRunner.query(`ALTER TABLE "salesreport" DROP CONSTRAINT "FK_3c409832dd31e20eb1fe92fb656"`);
        await queryRunner.query(`ALTER TABLE "salesreport" DROP CONSTRAINT "FK_c33bbe589e43785348d38d1312c"`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "businessId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_14b2f80fd7140b837b205610ac1" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "doingBusinessAs"`);
        await queryRunner.query(`DROP TABLE "salesreport"`);
    }

}
