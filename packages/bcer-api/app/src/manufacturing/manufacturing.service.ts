import { getConnectionManager, In, Repository } from 'typeorm';
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

  async getLocationsWithManufactures(locationIds: string[]): Promise<Record<string, ManufacturingEntity[]>> {
    if (locationIds.length === 0) { return {} };
    const db = getConnectionManager().get();
    const locationManufactures = await db.query(`SELECT * FROM location_manufactures_manufacturing WHERE "locationId" IN ('${locationIds.join("','")}')`);

    // Get all manufactures associated with the passed in locations
    const allManufactures = locationManufactures.reduce((all, lm) => {
      all.push(lm.manufacturingId);
      return all;
    }, []);

    // Get full manufactures
    const manufactures = await this.getManufacturesWithIds(allManufactures);
    const manufacturesDictionary = manufactures.reduce((mDict, m) => {
      mDict[m.id] = m;
      return mDict;
    }, {});

    // Get all manufactures per location
    const locationManufacturesDictionary: Record<string, ManufacturingEntity[]> = locationManufactures.reduce((lmDict, lm) => {
      if (!!lmDict[lm.locationId]) {
        lmDict[lm.locationId].push(manufacturesDictionary[lm.manufacturingId]);
      } else {
        lmDict[lm.locationId] = [manufacturesDictionary[lm.manufacturingId]];
      }
      return lmDict;
    }, {});

    return locationManufacturesDictionary;
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
    const report = await this.manufacturingRepository.findOne({
      where: { id: reportId },
      relations: ['business', 'locations', 'ingredients' ]
    });
    return report;
  }

  async clearManufacturing() {
    await this.manufacturingRepository.delete({})
    return;
  }

  async assignManufacturingToNewBusiness(currentBusinessId: string, newBusinessId: string){
    const result = await this.manufacturingRepository
    .query(`UPDATE manufacturing SET "businessId" = $1 WHERE "businessId" = $2`, [newBusinessId, currentBusinessId])
    return result;
  }

  async softDeleteManufacturing(reportId: string){
    await this.manufacturingRepository.softDelete({ id: reportId });
  }
}
