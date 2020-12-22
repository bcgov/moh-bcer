import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ManufacturingEntity } from 'src/manufacturing/entities/manufacturing.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { IngredientEntity } from 'src/manufacturing/entities/ingredient.entity';
import { IngredientDTO } from 'src/manufacturing/dto/ingredient.dto';
import { ManufacturingDTO } from 'src/manufacturing/dto/manufacturing.dto';

@Injectable()
export class ManufacturingService {
  constructor(
  @InjectRepository(ManufacturingEntity)
    private readonly manufacturingRepository: Repository<ManufacturingEntity>,
  @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
  @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}
  async createManufacturingReport(dto: ManufacturingDTO, businessId: string) {
    const locations = await this.locationRepository.createQueryBuilder('locations')
      .where('locations.id IN (:...locationIds)', { locationIds: dto.locationIds })
      .getMany()

    const ingredients = await Promise.all(dto.ingredients.map((ingredient: IngredientDTO) => {
      const i = this.ingredientRepository.create(ingredient);
      return i;
    }))
    const manufacturingEntity = this.manufacturingRepository.create({
      productName: dto.productName,
      business: { id: businessId },
      ingredients,
      locations,
    });
    const report = await this.manufacturingRepository.save(manufacturingEntity);
    return report;
  }

  async getManufacturesWithIds(manufacturingIds: string[]): Promise<ManufacturingEntity[]> {
    if (manufacturingIds.length === 0) return [];
    const manufactures = await this.manufacturingRepository.find({
      where: {
        id: In(manufacturingIds),
      }, relations: ['ingredients']
    });
    return manufactures;
  }

  async getManufacturingLocations(businessId: string) {
    const locations = await this.locationRepository.createQueryBuilder('locations')
      .leftJoinAndSelect('locations.manufactures', 'manufactures')
      .leftJoinAndSelect('locations.business', 'business')
      .where('locations.manufacturing = :val', { val: true })
      .andWhere('business.id = :businessId', { businessId })
      .getMany();
    return locations;
  }
  async getManufacturing(businessId: string) {
    const manufacturings = await this.manufacturingRepository.find({ where: { business: { id: businessId } }, relations: ['locations', 'ingredients'] });
    return manufacturings;
  }

  async getManufacturingReportById(reportId) {
    const report = await this.manufacturingRepository.findOne(reportId, { relations: ['business', 'locations', 'ingredients' ]});
    return report;
  }

  async clearManufacturing() {
    await this.manufacturingRepository.delete({})
    return;
  }
}
