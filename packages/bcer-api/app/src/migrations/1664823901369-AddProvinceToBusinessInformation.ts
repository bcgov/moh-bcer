import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProvinceToBusinessInformation1664823901369 implements MigrationInterface {
    name = 'AddProvinceToBusinessInformation1664823901369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "province" ("id" character(2) NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_province" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('AB', 'Alberta')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('BC', 'British Columbia')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('MB', 'Manitoba')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('NB', 'New Brunswick')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('NL', 'Newfoundland and Labrador')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('NS', 'Nova Scotia')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('NT', 'Northwest Territories')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('NU', 'Nunavut')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('ON', 'Ontario')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('PE', 'Prince Edward Island')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('QC', 'Quebec')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('SK', 'Saskatchewan')`);
        await queryRunner.query(`INSERT INTO province(id, name) VALUES ('YT', 'Yukon')`);
        await queryRunner.query(`ALTER TABLE "business" ADD "province" character(2)`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_business_province" FOREIGN KEY ("province") REFERENCES "province"("id") ON UPDATE NO ACTION ON DELETE NO ACTION`);      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {        
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "province"`);
        await queryRunner.query(`DROP TABLE "province"`);
    }

}
