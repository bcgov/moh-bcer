import {MigrationInterface, QueryRunner} from "typeorm";

export class NotesTable1659555306536 implements MigrationInterface {
    name = 'NotesTable1659555306536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" DROP CONSTRAINT "FK_c82b01c5f9e5e5e0b2209a79bbf"`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" DROP CONSTRAINT "FK_90d84ea0dfd43253b13a46a782f"`);
        await queryRunner.query(`ALTER TABLE "location_products_product" DROP CONSTRAINT "FK_9ae91de2cac9985e19708b8c89e"`);
        await queryRunner.query(`ALTER TABLE "location_products_product" DROP CONSTRAINT "FK_85868efd7c6e32cb69eb7572d58"`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" DROP CONSTRAINT "FK_92d15a2d2b599462581cb193dcb"`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" DROP CONSTRAINT "FK_d2f14c98610e62cf682d9ddc477"`);
        await queryRunner.query(`CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "content" character varying(1024) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "businessId" uuid, "locationId" uuid, "userId" uuid, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_7270e41b04fef1627d08c3fe72d" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_856229f7d334a47b972a0d56feb" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" ADD CONSTRAINT "FK_c82b01c5f9e5e5e0b2209a79bbf" FOREIGN KEY ("manufacturingId") REFERENCES "manufacturing"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" ADD CONSTRAINT "FK_90d84ea0dfd43253b13a46a782f" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_products_product" ADD CONSTRAINT "FK_9ae91de2cac9985e19708b8c89e" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "location_products_product" ADD CONSTRAINT "FK_85868efd7c6e32cb69eb7572d58" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" ADD CONSTRAINT "FK_92d15a2d2b599462581cb193dcb" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" ADD CONSTRAINT "FK_d2f14c98610e62cf682d9ddc477" FOREIGN KEY ("manufacturingId") REFERENCES "manufacturing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" DROP CONSTRAINT "FK_d2f14c98610e62cf682d9ddc477"`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" DROP CONSTRAINT "FK_92d15a2d2b599462581cb193dcb"`);
        await queryRunner.query(`ALTER TABLE "location_products_product" DROP CONSTRAINT "FK_85868efd7c6e32cb69eb7572d58"`);
        await queryRunner.query(`ALTER TABLE "location_products_product" DROP CONSTRAINT "FK_9ae91de2cac9985e19708b8c89e"`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" DROP CONSTRAINT "FK_90d84ea0dfd43253b13a46a782f"`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" DROP CONSTRAINT "FK_c82b01c5f9e5e5e0b2209a79bbf"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_856229f7d334a47b972a0d56feb"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_7270e41b04fef1627d08c3fe72d"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" ADD CONSTRAINT "FK_d2f14c98610e62cf682d9ddc477" FOREIGN KEY ("manufacturingId") REFERENCES "manufacturing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_manufactures_manufacturing" ADD CONSTRAINT "FK_92d15a2d2b599462581cb193dcb" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_products_product" ADD CONSTRAINT "FK_85868efd7c6e32cb69eb7572d58" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_products_product" ADD CONSTRAINT "FK_9ae91de2cac9985e19708b8c89e" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" ADD CONSTRAINT "FK_90d84ea0dfd43253b13a46a782f" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "manufacturing_ingredients_ingredient" ADD CONSTRAINT "FK_c82b01c5f9e5e5e0b2209a79bbf" FOREIGN KEY ("manufacturingId") REFERENCES "manufacturing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
