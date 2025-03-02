import { In, Repository, Brackets, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ForbiddenException } from '@nestjs/common';

import { SetupBusinessDTO, BusinessDTO } from 'src/business/dto/business.dto';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationStatus } from 'src/location/enums/location-status.enum';
import { LocationService } from 'src/location/location.service';
import { BusinessReportType } from './enums/businessReportType.enum';
import { HealthAuthority } from './enums/health-authority.enum';
import { BusinessReportList } from './enums/businessReportList.enum';
import { SearchDto } from './dto/search.dto';
import { BusinessSearchCategory } from './enums/businessSearchCategory.enum';
import { BusinessStatus } from './enums/business-status.enum';
import moment from 'moment';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
    private readonly locationService: LocationService,
    private readonly dataSource: DataSource,
  ) {}

  async createBusiness(dto?: BusinessDTO | SetupBusinessDTO) {
    const business = this.businessRepository.create(dto);
    return await this.saveBusiness(business);
  }

  async saveBusiness(business: BusinessEntity) {
    return await this.businessRepository.save(business);
  }

  async getBusinesses(payload?: { relations?: string[] }) {
    let relations = ['users', 'locations', 'submissions'];
    if (payload?.relations?.length) {
      relations = payload.relations;
    }
    const businesses = await this.businessRepository.find({ relations });
    return businesses;
  }

  async clearBusinesses() {
    await this.businessRepository.delete({});
    return;
  }

  async getBusiness(legalName: string) {
    const business = await this.businessRepository.findOne({
      where: { legalName },
      relations: ['users', 'locations', 'submissions'],
    });
    return business;
  }

  async getBusinessById(id: string, includes?: string) {
    if (includes?.includes('locations')) {
      return await this.getBusinessWithLocationsById(id, includes);
    }
    const business = await this.businessRepository.findOne({ 
      where: { id },
      relations: includes ? includes.split(',') : [],
    });
    return business;
  }

  async getBusinessesWithIds(businessIds: string[]): Promise<BusinessEntity[]> {
    if (businessIds.length === 0) return [];
    const products = await this.businessRepository.find({
      where: {
        id: In(businessIds),
      },
    });
    return products;
  }

  /**
   * Filter locations with status. Not query deleted locations.
   * @param id
   * @returns
   */
  async getBusinessWithLocationsById(id: string, includes: string) {
    const businessQuery = this.businessRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.locations', 'l')
      .where('b.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('l.status NOT IN (:...status)', {
            status: [LocationStatus.Deleted],
          }).orWhere('l.status IS NULL');
        }),
      );

    const remainIncludes = includes
      .split(',')
      .filter((location) => location !== 'locations');
    remainIncludes.forEach((include) => {
      if (!['noi', 'products', 'manufactures', 'sales'].includes(include)) {
        throw new ForbiddenException('Invalid includes');
      }

      businessQuery.leftJoinAndSelect(`l.${include}`, include);
    });

    const business = await businessQuery.getOne();

    return business;
  }

  async getComplianceOverview(type?: BusinessReportType) {
    let compliant;
    let nonCompliant;
    let total;
    // this is old code that may be depricated but kept for now 
    // TODO: check if the type parameter is ever used or needed
    if (type){
      let [businesses, total1] = await this.listBusinesses();
      compliant = 0;
      nonCompliant = 0;
      total = total1

      businesses?.map(async (business) => {
        const result = this.locationService.checkLocationReportComplete(
          business?.locations || [],
          {
            type,
            exitEarly: true,
          }
        );
        if(result.earlyMissingConfirmed){
          nonCompliant++;
        }else{
          compliant++;
        } 
      })
    } else {
      const qb1 = this.businessRepository.createQueryBuilder('business');
      qb1.where("business.legalName IS NOT NULL AND business.legalName != ''");
      total = await qb1.getCount();
      
      const qb2 = this.businessRepository.createQueryBuilder('business');
      qb2.andWhere(`
        (business.id  in  (
          SELECT DISTINCT
              business2.id
          FROM "business" as business2
          WHERE "business2"."legalName" IS NOT NULL AND "business2"."legalName" != ''
          AND ("business2"."id" in( select business_id from noi_report_vw) 
          OR "business2"."id"  in ( select business_id from manufacturing_report_vw )
          OR "business2"."id"  in ( select business_id from sales_report_vw )
          OR "business2"."id"  in ( select business_id from product_report_vw ))))
        `);
      nonCompliant = await qb2.getCount();

      compliant = total - nonCompliant;
    }
    return {compliant, nonCompliant, total };
  }

  async getBusinessIdsForHA(healthAuthority: HealthAuthority): Promise<string[]> {
    const businessIds = await this.dataSource.query(
      `WITH full_bus_list AS
        (SELECT
        bus.id,
        bus."businessName",
        bus."legalName",
        loc.health_authority
        FROM business bus LEFT OUTER JOIN location loc ON bus.id = loc."businessId"
        GROUP BY bus."id", bus."legalName",bus."businessName",loc.health_authority)
        SELECT id FROM full_bus_list WHERE health_authority = $1`, [healthAuthority]
    );
    return businessIds.map(b => b.id);
  }

  async listBusinesses(query?: SearchDto, businessIds?: string[]){
    const {search, category, reports, page, pageSize} = query || {};

    const qb = this.businessRepository.createQueryBuilder('business');
    qb.leftJoinAndSelect('business.locations', 'location')
      .leftJoinAndSelect('location.noi', 'noi')
      .loadRelationCountAndMap('location.salesCount', 'location.sales')
      .loadRelationCountAndMap('location.productsCount', 'location.products')
      .loadRelationCountAndMap('location.manufacturesCount', 'location.manufactures')
      .where("coalesce(business.legalName, '') != ''")

    if(reports === BusinessReportList.Outstanding){
      qb.andWhere(`
      (business.id  in  (
        SELECT DISTINCT
            business2.id
        FROM "business" as business2
        WHERE COALESCE("business2"."legalName", '') != ''
        AND ("business2"."id" in( select business_id from noi_report_vw) 
        OR "business2"."id"  in ( select business_id from manufacturing_report_vw )
        OR "business2"."id"  in ( select business_id from sales_report_vw )
        OR "business2"."id"  in ( select business_id from product_report_vw ))))
      `);
    } else if (reports === BusinessReportList.Complete) {
      qb.andWhere(`
        (business.id  not in  (
          SELECT DISTINCT
              business2.id
          FROM "business" as business2
          WHERE COALESCE("business2"."legalName", '') != ''
          AND ("business2"."id" in( select business_id from noi_report_vw) 
          OR "business2"."id"  in ( select business_id from manufacturing_report_vw )
          OR "business2"."id"  in ( select business_id from sales_report_vw )
          OR "business2"."id"  in ( select business_id from product_report_vw ))))
      `);
    }
    
    if (query) {
      if (query.orderBy === 'Business Name') {
        qb.addSelect('REPLACE(TRIM("business"."businessName"), E\'\\t\', \'\')', 'b_businessname');
        qb.orderBy('b_businessname', query.order);
      } else if (query.orderBy === 'Address') {
        qb.addSelect('REPLACE(TRIM("business"."addressLine1"), E\'\\t\', \'\')', 'b_address_line1');
        qb.orderBy('b_address_line1', query.order);
      } else if (query.orderBy === 'City') {
        qb.addSelect('REPLACE(TRIM("business"."city"), E\'\\t\', \'\')', 'b_city');
        qb.orderBy('b_city', query.order);
      }
    }

    if(search && Object.values(BusinessSearchCategory).includes(category) && category !== BusinessSearchCategory.Postal){
      qb.andWhere(`regexp_replace(LOWER(business.${category}), '[^a-zA-Z0-9]', '', 'g') LIKE :search`, {search: `%${search.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}%`})
    }else if(search && category === BusinessSearchCategory.Postal){
      qb.andWhere(`REPLACE(LOWER(business.postal), ' ', '') LIKE REPLACE(:search, ' ', '')`, {search: `%${search.toLowerCase()}%`})
    }else if(search) {
      qb.andWhere(`
        (
          regexp_replace(LOWER(business.addressLine1), '[^a-zA-Z0-9]', '', 'g') LIKE :search OR
          LOWER(business.city) LIKE :search OR
          REPLACE(LOWER(business.postal), ' ', '') LIKE REPLACE(:search, ' ', '') OR
          regexp_replace(LOWER(business.legalName), '[^a-zA-Z0-9]', '', 'g') LIKE :search OR
          regexp_replace(LOWER(business.businessName), '[^a-zA-Z0-9]', '', 'g') LIKE :search
        )
      `, { search: `%${query.search.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}%` });
    }

    if(businessIds?.length){
      qb.andWhere('business.id IN (:...businessIds)', { businessIds })
    }

    if(page && pageSize){
      qb.skip((page - 1) * pageSize);
      qb.take(pageSize);
    }
    const businesses = await qb.getManyAndCount();
    return businesses;
  }
  
  async closeBusiness(businessId: string, closedTime: number, user: UserEntity) {
    const result = await this.businessRepository.update(
      { id: businessId },
      { 
        status: BusinessStatus.Closed,
        closed_at: closedTime ? moment(closedTime).toDate(): moment().toDate(),
        closed_by: user
      },
    );
    return result;
  }
}
