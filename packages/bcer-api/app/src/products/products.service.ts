import { getConnectionManager, In, Repository } from 'typeorm';
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
    });
    return products;
  }

  async getLocationsWithProducts(locationIds: string[]): Promise<Record<string, ProductEntity[]>> {
    if (locationIds.length === 0) { return {} };
    const db = getConnectionManager().get();
    const locationProducts = await db.query(`SELECT * FROM location_products_product WHERE "locationId" IN ('${locationIds.join("','")}')`);
    
    // Get all products associated with the passed in locations
    const allProducts = locationProducts.reduce((all, lp) => {
      all.push(lp.productId);
      return all;
    }, []);

    // Get full products
    const products = await this.getProductsWithIds(allProducts);
    const productsDictionary = products.reduce((pDict, p) => {
      pDict[p.id] = p;
      return pDict;
    }, {});

    // Get all products per location
    const locationProductsDictionary: Record<string, ProductEntity[]> = locationProducts.reduce((lpDict, lp) => {
      if (!!lpDict[lp.locationId]) {
        lpDict[lp.locationId].push(productsDictionary[lp.productId]);
      } else {
        lpDict[lp.locationId] = [productsDictionary[lp.productId]];
      }
      return lpDict;
    }, {});

    return locationProductsDictionary;
  }

  async clearProducts() {
    await this.productRepository.delete({})
    return;
  }
}
