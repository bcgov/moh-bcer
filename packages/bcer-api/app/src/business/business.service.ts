import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { SetupBusinessDTO, BusinessDTO } from 'src/business/dto/business.dto';
import { BusinessEntity } from 'src/business/entities/business.entity';

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
}
