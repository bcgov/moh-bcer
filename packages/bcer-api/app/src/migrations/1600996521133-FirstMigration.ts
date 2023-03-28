import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1600996521133 implements MigrationInterface {
    name = 'FirstMigration1600996521133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "submission_type_enum" AS ENUM('Sales Report', 'Product Report', 'Manufacturing Report', 'Notice of Intent', 'Location')`);
        await queryRunner.query(`CREATE TABLE "submission" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "businessId" uuid NOT NULL, "type" "submission_type_enum" NOT NULL, "data" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "noi" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "businessId" uuid, CONSTRAINT "PK_9a8fbcc2783bf174923c170a7a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "type" character varying NOT NULL, "brandName" character varying NOT NULL, "productName" character varying NOT NULL, "manufacturerName" character varying NOT NULL, "manufacturerAddress" character varying NOT NULL, "manufacturerPhone" character varying NOT NULL, "manufacturerEmail" character varying NOT NULL, "manufacturerContact" character varying NOT NULL, "concentration" character varying NOT NULL, "containerCapacity" character varying NOT NULL, "cartridgeCapacity" character varying NOT NULL, "ingredients" character varying NOT NULL, "flavour" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "businessId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "scientificName" character varying NOT NULL, "manufacturerName" character varying NOT NULL, "manufacturerAddress" character varying NOT NULL, "manufacturerPhone" character varying NOT NULL, "manufacturerEmail" character varying NOT NULL, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "manufacturing" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "productName" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "businessId" uuid, CONSTRAINT "PK_7b9e3a099ce64e9b7a72e07cf33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "location_health_authority_enum" AS ENUM('fraser', 'interior', 'island', 'northern', 'coastal')`);
        await queryRunner.query(`CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" character varying NOT NULL, "webpage" character varying, "addressLine1" character varying NOT NULL, "addressLine2" character varying, "city" character varying NOT NULL, "postal" character varying NOT NULL, "phone" character varying NOT NULL, "underage" character varying NOT NULL, "health_authority" "location_health_authority_enum" NOT NULL DEFAULT 'island', "manufacturing" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "businessId" uuid, "noiId" uuid, CONSTRAINT "REL_ccaa914aa532ae36790cdbc417" UNIQUE ("noiId"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_type_enum" AS ENUM('bo', 'ministry', 'ha')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_status_id" integer NOT NULL DEFAULT 1, "type" "user_type_enum" NOT NULL DEFAULT 'bo', "first_name" character varying(255), "last_name" character varying(255), "email" character varying(255), "bceid" character varying(255) NOT NULL, "lastLogin" TIME, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "businessId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_47eb0be6cf3ded9fa702616d7d8" UNIQUE ("bceid"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "legalName" character varying DEFAULT '', "businessName" character varying DEFAULT '', "email" character varying DEFAULT '', "webpage" character varying DEFAULT '', "addressLine1" character varying DEFAULT '', "addressLine2" character varying DEFAULT '', "city" character varying DEFAULT '', "postal" character varying DEFAULT '', "phone" character varying DEFAULT '', "notificationPreferences" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_status" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, CONSTRAINT "PK_892a2061d6a04a7e2efe4c26d6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_type" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, CONSTRAINT "PK_1f9c6d05869e094dee8fa7d392a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "manufacturing_ingredients_ingredient" ("manufacturingId" uuid NOT NULL, "ingredientId" uuid NOT NULL, CONSTRAINT "PK_fb1061307b34a56bcb101e6584f" PRIMARY KEY ("manufacturingId", "ingredientId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c82b01c5f9e5e5e0b2209a79bb" ON "manufacturing_ingredients_ingredient" ("manufacturingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_90d84ea0dfd43253b13a46a782" ON "manufacturing_ingredients_ingredient" ("ingredientId") `);
        await queryRunner.query(`CREATE TABLE "location_products_product" ("locationId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_7a29e080e8d67cfc691b46ab8be" PRIMARY KEY ("locationId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9ae91de2cac9985e19708b8c89" ON "location_products_product" ("locationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_85868efd7c6e32cb69eb7572d5" ON "location_products_product" ("productId") `);
        await queryRunner.query(`CREATE TABLE "location_manufactures_manufacturing" ("locationId" uuid NOT NULL, "manufacturingId" uuid NOT NULL, CONSTRAINT "PK_a585f121989c2ca6e44951f7d12" PRIMARY KEY ("locationId", "manufacturingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_92d15a2d2b599462581cb193dc" ON "location_manufactures_manufacturing" ("locationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2f14c98610e62cf682d9ddc47" ON "location_manufactures_manufacturing" ("manufacturingId") `);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_8393f784e5e03413de74a0f4716" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "noi" ADD CONSTRAINT "FK_5b4fbecf9c3dc7b08d11f5c2e7c" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_8b95800811275dd98a888044d50" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manufacturing" ADD CONSTRAINT "FK_d13c8610e84e0fabf4356f233b4" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_14b2f80fd7140b837b205610ac1" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_ccaa914aa532ae36790cdbc4171" FOREIGN KEY ("noiId") REFERENCES "noi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_324f2c4c7b658100d7f994e57b1" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" ADD CONSTRAINT "FK_c82b01c5f9e5e5e0b2209a79bbf" FOREIGN KEY ("manufacturingId") REFERENCES "manufacturing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" ADD CONSTRAINT "FK_90d84ea0dfd43253b13a46a782f" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_products_product" ADD CONSTRAINT "FK_9ae91de2cac9985e19708b8c89e" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_products_product" ADD CONSTRAINT "FK_85868efd7c6e32cb69eb7572d58" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" ADD CONSTRAINT "FK_92d15a2d2b599462581cb193dcb" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" ADD CONSTRAINT "FK_d2f14c98610e62cf682d9ddc477" FOREIGN KEY ("manufacturingId") REFERENCES "manufacturing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" DROP CONSTRAINT "FK_d2f14c98610e62cf682d9ddc477"`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" DROP CONSTRAINT "FK_92d15a2d2b599462581cb193dcb"`);
        await queryRunner.query(`ALTER TABLE "location_products_product" DROP CONSTRAINT "FK_85868efd7c6e32cb69eb7572d58"`);
        await queryRunner.query(`ALTER TABLE "location_products_product" DROP CONSTRAINT "FK_9ae91de2cac9985e19708b8c89e"`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" DROP CONSTRAINT "FK_90d84ea0dfd43253b13a46a782f"`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" DROP CONSTRAINT "FK_c82b01c5f9e5e5e0b2209a79bbf"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_324f2c4c7b658100d7f994e57b1"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_ccaa914aa532ae36790cdbc4171"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_14b2f80fd7140b837b205610ac1"`);
        await queryRunner.query(`ALTER TABLE "manufacturing" DROP CONSTRAINT "FK_d13c8610e84e0fabf4356f233b4"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_8b95800811275dd98a888044d50"`);
        await queryRunner.query(`ALTER TABLE "noi" DROP CONSTRAINT "FK_5b4fbecf9c3dc7b08d11f5c2e7c"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_8393f784e5e03413de74a0f4716"`);
        await queryRunner.query(`DROP INDEX "IDX_d2f14c98610e62cf682d9ddc47"`);
        await queryRunner.query(`DROP INDEX "IDX_92d15a2d2b599462581cb193dc"`);
        await queryRunner.query(`DROP TABLE "location_manufactures_manufacturing"`);
        await queryRunner.query(`DROP INDEX "IDX_85868efd7c6e32cb69eb7572d5"`);
        await queryRunner.query(`DROP INDEX "IDX_9ae91de2cac9985e19708b8c89"`);
        await queryRunner.query(`DROP TABLE "location_products_product"`);
        await queryRunner.query(`DROP INDEX "IDX_90d84ea0dfd43253b13a46a782"`);
        await queryRunner.query(`DROP INDEX "IDX_c82b01c5f9e5e5e0b2209a79bb"`);
        await queryRunner.query(`DROP TABLE "manufacturing_ingredients_ingredient"`);
        await queryRunner.query(`DROP TABLE "user_type"`);
        await queryRunner.query(`DROP TABLE "user_status"`);
        await queryRunner.query(`DROP TABLE "business"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_type_enum"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TYPE "location_health_authority_enum"`);
        await queryRunner.query(`DROP TABLE "manufacturing"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "noi"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TYPE "submission_type_enum"`);
    }

}
