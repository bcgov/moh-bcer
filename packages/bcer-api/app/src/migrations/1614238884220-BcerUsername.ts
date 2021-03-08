import {MigrationInterface, QueryRunner} from "typeorm";

export class BcerUsername1614238884220 implements MigrationInterface {
    name = 'BcerUsername1614238884220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "bceidUser" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bceidUser"`);
    }

}
