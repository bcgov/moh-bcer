import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCloseInformationToBusiness1671729404882 implements MigrationInterface {
    name = 'AddCloseInformationToBusiness1671729404882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."business_status_enum" AS ENUM('active', 'closed')`);
        await queryRunner.query(`ALTER TABLE "business" ADD "status" "public"."business_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "business" ADD "closed_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "business" ADD "closedById" uuid`);
         await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_2098cfa8e98abe9a47defec430b" FOREIGN KEY ("closedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_2098cfa8e98abe9a47defec430b"`);
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "closedById"`);
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "closed_at"`);
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."business_status_enum"`);
    }

}
