import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLocationCloseTime1655850030634 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // this is for saving the closed date which user wanted. `closed_at` is for system time. 
        await queryRunner.query(`ALTER TABLE "location" ADD COLUMN "closed_time" timestamp without time zone DEFAULT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "closed_time"`);
    }

}
