import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductSold1631689948434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS product_sold
        (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            concentration character varying,
            flavour character varying,
            upc character varying,
            created_at timestamp without time zone NOT NULL DEFAULT now(),
            updated_at timestamp without time zone NOT NULL DEFAULT now(),
            deleted_at timestamp without time zone,
            "businessId" uuid,
            brand_name character varying,
            product_name character varying,
            container_capacity character varying,
            cartridge_capacity character varying,
            "locationId" uuid,
            "saleId" uuid,
            CONSTRAINT "PK_bb0a3fc78551d922bf40fcb95bd" PRIMARY KEY (id),
            CONSTRAINT "UQ_9b83599a9b9049d48be7ffaab45" UNIQUE (upc),
            CONSTRAINT "UQ_c562a8b6dad3f3183388f5e3d97" UNIQUE ("saleId"),
            CONSTRAINT "FK_12a4111fe9779302deec9ad564e" FOREIGN KEY ("locationId")
                REFERENCES "location"("id")
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_64ade5ad3544a801853bde21f7e" FOREIGN KEY ("businessId")
                REFERENCES "business"("id")
                ON UPDATE NO ACTION
                ON DELETE NO ACTION,
            CONSTRAINT "FK_c562a8b6dad3f3183388f5e3d97" FOREIGN KEY ("saleId")
                REFERENCES "salesreport"("id")
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "product_sold"`);
  }
}
