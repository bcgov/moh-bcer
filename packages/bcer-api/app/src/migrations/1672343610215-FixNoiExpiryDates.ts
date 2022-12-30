import {MigrationInterface, QueryRunner} from "typeorm";

export class FixNoiExpiryDates1672343610215 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION calculate_noi_expiry_date(renewedOrCreatedDate timestamp without time zone) RETURNS timestamp without time zone AS $$
            DECLARE	
                validUntil CONSTANT VARCHAR := '01-15';  
                
                inputDateYear INTEGER  = date_part('year', renewedOrCreatedDate);
                inputDateMonth INTEGER  = date_part('month', renewedOrCreatedDate);
                inputDateDay INTEGER = date_part('day', renewedOrCreatedDate);
            BEGIN	
                if (inputDateMonth IN (10, 11, 12)) THEN
                    inputDateYear = inputDateYear + 2;
                ELSE
                    inputDateYear = inputDateYear + 1;
                END IF;
            
                RETURN CONCAT(inputDateYear,'-',validUntil);
            END;
            
            $$ LANGUAGE plpgsql;                        
        `);
        await queryRunner.query(`UPDATE noi set expiry_date = calculate_noi_expiry_date(COALESCE(noi.renewed_at, noi.created_at)) where id IN (select "noiId" from location where "noiId" is not null)`);
        await queryRunner.query(`DROP FUNCTION calculate_noi_expiry_date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION calculate_noi_expiry_date`);
    }

}
