import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductSubmissionDelete1616188427748 implements MigrationInterface {
    name = 'ProductSubmissionDelete1616188427748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "productUploadId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "productUploadId"`);
    }

}
