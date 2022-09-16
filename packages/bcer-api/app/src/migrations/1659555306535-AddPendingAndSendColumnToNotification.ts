import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPendingAndSendColumnToNotification1659555306535 implements MigrationInterface {
    name = 'AddPendingAndSendColumnToNotification1659555306535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "pending" json DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "sent" json DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "sent"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "pending"`);
    }

}
