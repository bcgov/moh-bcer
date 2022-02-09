import { In, Repository, Brackets, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ForbiddenException } from '@nestjs/common';

import { SetupBusinessDTO, BusinessDTO } from 'src/business/dto/business.dto';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationStatus } from 'src/location/enums/location-status.enum';
import { LocationService } from 'src/location/location.service';
import { BusinessReportType } from './enums/businessReportType.enum';
import { HealthAuthority } from './enums/health-authority.enum';
import { SearchDto } from './dto/search.dto';
import { BusinessSearchCategory } from './enums/businessSearchCategory.enum';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
    private readonly locationService: LocationService,
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
    const business = await this.businessRepository.findOne(id, {
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
    const [businesses, total] = await this.listBusinesses();
    let compliant = 0;
    let nonCompliant = 0;

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
    
    return {compliant, nonCompliant, total };
  }

  async getBusinessIdsForHA(healthAuthority: HealthAuthority): Promise<string[]>{
    const entityManger = getManager();
    const businessIds = await entityManger.query(
      `WITH full_bus_list AS
        (SELECT
        bus.id,
        bus."businessName",
        bus."legalName",
        loc.health_authority
        FROM business bus LEFT OUTER JOIN location loc ON bus.id = loc."businessId"
        GROUP BY bus."id", bus."legalName",bus."businessName",loc.health_authority)
        SELECT id FROM full_bus_list WHERE health_authority = $1`, [healthAuthority]
      )
      return businessIds.map(b => b.id);
  }

  async listBusinesses(query?: SearchDto, businessIds?: string[]){
    const {search, category, page, pageSize} = query || {};
    const qb = this.businessRepository.createQueryBuilder('business');
    qb.leftJoinAndSelect('business.locations', 'location')
      .leftJoinAndSelect('location.noi', 'noi')
      .loadRelationCountAndMap('location.salesCount', 'location.sales')
      .loadRelationCountAndMap('location.productsCount', 'location.products')
      .loadRelationCountAndMap('location.manufacturesCount', 'location.manufactures')
      .where("coalesce(business.legalName, '') != ''")
    
    if(search && Object.values(BusinessSearchCategory).includes(category) && category !== BusinessSearchCategory.Postal){
      qb.andWhere(`LOWER(business.${category}) LIKE :search`, {search: `%${search.toLowerCase()}%`})
    }else if(search && category === BusinessSearchCategory.Postal){
      qb.andWhere(`REPLACE(LOWER(business.postal), ' ', '') LIKE REPLACE(:search, ' ', '')`, {search: `%${search.toLowerCase()}%`})
    }else if(search) {
      qb.andWhere(`
        (
          LOWER(business.addressLine1) LIKE :search OR
          LOWER(business.city) LIKE :search OR
          REPLACE(LOWER(business.postal), ' ', '') LIKE REPLACE(:search, ' ', '') OR
          LOWER(business.legalName) LIKE :search OR
          LOWER(business.businessName) LIKE :search
        )
      `, { search: `%${search.toLowerCase()}%` });
    }

    if(businessIds?.length){
      qb.andWhere('business.id IN (:...businessIds)', { businessIds })
    }

    if(page && pageSize){
      qb.offset((page - 1) * pageSize);
      qb.limit(pageSize);
    }
    const businesses = await qb.getManyAndCount();
    return businesses;
  }
  
}
