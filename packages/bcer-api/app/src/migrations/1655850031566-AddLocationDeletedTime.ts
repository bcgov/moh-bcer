import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLocationDeletedTime1655850031566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Column for saving system time manual deleted at timestamp 
        await queryRunner.query(`ALTER TABLE "location" ADD COLUMN "deleted_at" timestamp without time zone DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "deleted_at"`);
    }

}
