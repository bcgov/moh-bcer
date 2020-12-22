import { In, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from 'src/products/entities/product.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { ProductsDTO } from 'src/products/dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(
  @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}
  async createProducts(dto: ProductsDTO, businessId: string) {

    const locations = await this.locationRepository.createQueryBuilder('locations')
      .where('locations.id IN (:...locationIds)', { locationIds: dto.locationIds })
      .getMany()
    Logger.log(`Creating products for ${locations.length} locations`);
    const productEntities = this.productRepository.create(dto.products.map((product: any) => ({ ...product, business: { id: businessId }, locations })));
    await this.productRepository.save(productEntities);

    // TODO track error if the locationIds length does not match the length of returned products
    const products = await this.productRepository.createQueryBuilder('products')
      .leftJoinAndSelect('products.locations', 'location')
      .where('location.id IN (:...locationIds)', { locationIds: dto.locationIds })
      .getMany();

    return products;
  }

  async getProducts(businessId: string) {
    const products = await this.productRepository.find({ where: { business: { id: businessId } }, relations: ['locations'] });
    products.forEach((product: any) => {
      if (Array.isArray(product.ingredients)) {
        product.ingredients = product.ingredients.join(',');
      }
    });
    return products;
  }

  async getProductsWithIds(productIds: string[]): Promise<ProductEntity[]> {
    if (productIds.length === 0) return [];
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      }
    })
    return products;
  }

  async clearProducts() {
    await this.productRepository.delete({})
    return;
  }
}
