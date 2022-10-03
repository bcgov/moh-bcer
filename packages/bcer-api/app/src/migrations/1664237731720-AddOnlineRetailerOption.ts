import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOnlineRetailerOption1664237731720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "location_type" AS ENUM('online', 'physical', 'both')`);
        await queryRunner.query(`ALTER TABLE "location" ADD "location_type" "location_type" DEFAULT 'physical'`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "addressLine1" DROP NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN city DROP NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN postal DROP NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN underage DROP NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN health_authority DROP NOT NULL`);    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "location_type"`);
        await queryRunner.query(`DROP TYPE "location_type"`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "addressLine1" SET NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN city SET NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN postal SET NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN underage SET NOT NULL`);    
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN health_authority SET NOT NULL`) 
    }

}
