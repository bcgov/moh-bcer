import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNoiExpiryDate1670017637249 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION calculate_noi_expiry_date(renewedOrCreatedDate timestamp without time zone) RETURNS timestamp without time zone AS $$
            DECLARE
                renewalStart constant varchar := '10-01'; 
                validUntil CONSTANT VARCHAR := '01-15';  
                currentYear constant char(4) := date_part('year', now());	
                
                renewalStartDate constant date := CONCAT(currentYear, '-', renewalStart, ' 00:00:00');
                validUntilDate date := CONCAT(currentYear, '-', validUntil, ' 00:00:00') ;
                
            BEGIN
                validUntilDate = validUntilDate + interval '1 year';
            
                if (now() >= renewalStartDate AND renewedOrCreatedDate >= renewalStartDate) then
                    validUntilDate = validUntilDate + interval '1 year';
                end if;
                
                RETURN validUntilDate;
            END;
            
            $$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`ALTER TABLE "noi" ADD COLUMN "expiry_date" timestamp without time zone DEFAULT NULL`);
        await queryRunner.query(`UPDATE noi set expiry_date = calculate_noi_expiry_date(COALESCE(noi.renewed_at, noi.created_at)) where id IN (select "noiId" from location where "noiId" is not null)`);
        await queryRunner.query(`DROP FUNCTION calculate_noi_expiry_date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION calculate_noi_expiry_date`);
        await queryRunner.query(`ALTER TABLE "noi" DROP COLUMN "expiry_date`);
    }

}
