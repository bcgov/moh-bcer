import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateReportEntity1679341863819 implements MigrationInterface {
    name = 'CreateReportEntity1679341863819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "query" json NOT NULL, "result" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "generated_by" uuid NOT NULL, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_6f9e2913253a9e92fcaa119fdf7" FOREIGN KEY ("generated_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_6f9e2913253a9e92fcaa119fdf7"`);
        await queryRunner.query(`DROP TABLE "report"`);
    }

}
