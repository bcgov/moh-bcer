import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavouriteEntity1675274856570 implements MigrationInterface {
    name = 'AddFavouriteEntity1675274856570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favourite" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying(50) NOT NULL, "search_params" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_56f1996fc2983d1895e4a8f3af3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favourite" ADD CONSTRAINT "FK_55262b1e0fdf72d3443562a9c3d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourite" DROP CONSTRAINT "FK_55262b1e0fdf72d3443562a9c3d"`);
        await queryRunner.query(`DROP TABLE "favourite"`);
    }

}