import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLocationDeletedTime1655850031566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE location_health_authority_enum ADD VALUE 'other'`);
        await queryRunner.query(`ALTER TABLE "location" ADD COLUMN "health_authority_other" character varying(255) default null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // There is no support to remove a value from an existing type.
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "health_authority_other"`);
    }

}
