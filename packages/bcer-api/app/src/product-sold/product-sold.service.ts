import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LocationEntity } from 'src/location/entities/location.entity';
import { ProductSoldEntity } from './entities/product-sold.entity';
import { ProductSoldDTO } from './dto/product-sold.dto';
import { BusinessEntity } from 'src/business/entities/business.entity';

@Injectable()
export class ProductSoldService {
  constructor(
    @InjectRepository(ProductSoldEntity)
    private readonly productSoldRepository: Repository<ProductSoldEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
  ) {}
  async createProductSold(
    dtos: ProductSoldDTO[],
    businessId: string,
    locationId: string,
  ): Promise<ProductSoldEntity[]> {
    let productSolds = this.productSoldRepository.create(dtos);
    const business = await this.businessRepository.findOneOrFail({
      where: {id: businessId}
    });
    const location = await this.locationRepository.findOneOrFail({
      where: {id: locationId}
    });

    productSolds = productSolds.map(productSold => {
      productSold.business = business;
      productSold.location = location;
      return productSold;
    });

    return this.productSoldRepository.save(productSolds, { chunk: 500 });
  }

  async remove(existingProductSolds: ProductSoldEntity[]) {
    this.productSoldRepository.remove(existingProductSolds, { chunk: 100 });
  }

  async assignProductSoldToNewBusiness(currentBusinessId: string, newBusinessId: string){
    const result = await this.productSoldRepository
    .query(`UPDATE product_sold SET "businessId" = $1 WHERE "businessId" = $2`, [newBusinessId, currentBusinessId])
    return result;
  }
}
