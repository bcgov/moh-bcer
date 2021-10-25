import { In, Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ForbiddenException } from '@nestjs/common';

import { SetupBusinessDTO, BusinessDTO } from 'src/business/dto/business.dto';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationStatus } from 'src/location/enums/location-status.enum';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
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
    const business = await this.businessRepository.findOne({ where: { legalName }, relations: ['users', 'locations', 'submissions'] });
    return business;
  }

  async getBusinessById(id: string, includes?: string) {
    if (includes?.includes('locations')) {
      return await this.getBusinessWithLocationsById(id, includes);
    }
    const business = await this.businessRepository.findOne(id, {
      relations: includes ? includes.split(',') : []
    });
    return business;
  }

  async getBusinessesWithIds(businessIds: string[]): Promise<BusinessEntity[]> {
    if (businessIds.length === 0) return [];
    const products = await this.businessRepository.find({
      where: {
        id: In(businessIds),
      }
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
    .andWhere(new Brackets(qb => {
      qb.where('l.status NOT IN (:...status)', { status: [LocationStatus.Deleted] })
      .orWhere('l.status IS NULL');                                 
    }));

    const remainIncludes = includes.split(',').filter(location => location !== 'locations');
    remainIncludes.forEach((include) => {
      if (!['noi', 'products', 'manufactures', 'sales'].includes(include)) {
        throw new ForbiddenException('Invalid includes');
      }
      
      businessQuery.leftJoinAndSelect(`l.${include}`, include);
    });

    const business = await businessQuery.getOne();

    return business;
  }
}
