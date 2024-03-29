import {MigrationInterface, QueryRunner} from "typeorm";

export class FaqTable1659555307942 implements MigrationInterface {
    name = 'FaqTable1659555306536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faq" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "content" JSONB)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "faq"`);
    }

}
