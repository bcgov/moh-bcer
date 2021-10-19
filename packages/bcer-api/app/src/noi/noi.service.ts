import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoiDTO } from 'src/noi/dto/noi.dto';
import { NoiEntity } from 'src/noi/entities/noi.entity';

import { BusinessService } from 'src/business/business.service';
import { LocationService } from 'src/location/location.service';
import moment from 'moment';

@Injectable()
export class NoiService {
  constructor(
    private readonly locationService: LocationService,
    private readonly businessService: BusinessService,
    @InjectRepository(NoiEntity)
    private readonly noiRepository: Repository<NoiEntity>,
  ) {}

  async createOrRenewNois(locationIds: string[], businessId: string) {
    const business = await this.businessService.getBusinessById(businessId);

    // TODO refactor into a single find of all locations then map on them
    return Promise.all(locationIds.map(async (locationId: string) => {
      const location = await this.locationService.getLocation(locationId, 'business,noi');
      
      if (location.business.id !== businessId) {
        throw new ForbiddenException(`This user does not have access to location ${locationId}`);
      }
      if(location.noi?.id){
        await this.noiRepository.update({ id: location.noi.id }, { renewed_at: moment().toDate() });
      }else{
        const noi = this.noiRepository.create({ location, business });
        await this.noiRepository.save(noi);
      }
      
      const updatedLocation = await this.locationService.getLocation(locationId);
      return updatedLocation;
    }));
  }

  async createSingleNoi(dto: NoiDTO, businessId: string) {
    const business = await this.businessService.getBusinessById(businessId);
    const noi = this.noiRepository.create({ ...dto, business });
    await this.noiRepository.save(noi);
    return noi;
  }

  async deleteNois() {
    await this.noiRepository.delete({});
    return;
  }

  async getNois(businessId: string) {
    const nois = await this.noiRepository.createQueryBuilder('nois')
      .leftJoinAndSelect('nois.business', 'business')
      .leftJoinAndSelect('nois.location', 'location')
      .where('business.id = :businessId', { businessId })
      .getMany();
    return nois;
  }
}
