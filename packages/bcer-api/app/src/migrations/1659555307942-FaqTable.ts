import {MigrationInterface, QueryRunner} from "typeorm";

export class NotesTable1659555306536 implements MigrationInterface {
    name = 'NotesTable1659555306536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faq" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" JSONB)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "faq"`);
    }

}
