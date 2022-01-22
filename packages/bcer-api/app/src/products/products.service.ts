import { getConnectionManager, getManager, In, Repository } from 'typeorm';
import { ForbiddenException, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

import { LocationEntity } from 'src/location/entities/location.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductsDTO } from './dto/products.dto';
import { ProductUploadRO } from './ro/product-upload.ro';
import { PaginatedProductQuery } from './dto/paginatedProductQuery.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) { }
  async createProducts(dto: ProductsDTO, businessId: string) {
    if (dto.locationIds.length * dto.products.length > 200000) {
      throw new ForbiddenException('Attempting to create too many products');
    }

    const locations = await this.locationRepository.createQueryBuilder('locations')
      .where('locations.id IN (:...locationIds)', { locationIds: dto.locationIds })
      .getMany()
    Logger.log(`Creating products for ${locations.length} locations`);

    const productUploadId = uuid();

    dto.products = dto.products.map(product => {
      return {
        ...product,
        productUploadId,
      };
    });

    try {
      return await getManager().transaction(async transactionManager => {
        const productEntities = this.productRepository.create(dto.products.map((product: any) => ({ ...product, business: { id: businessId } })));
        const savedProducts = await transactionManager.save(productEntities, { chunk: Math.ceil(productEntities.length / 300) });

        let sql = `INSERT INTO location_products_product("locationId", "productId") VALUES `;
        const allProductLocations = [];
        for (const locationId of dto.locationIds) {
          savedProducts.forEach(product => {
            allProductLocations.push({ locationId, productId: product.id });
          });
        }

        allProductLocations.forEach(pl => {
          sql += `('${pl.locationId}', '${pl.productId}'),`;
        });
        sql = sql.slice(0, -1);
        return await transactionManager.query(sql);
      });
    } catch (e) {
      throw new UnprocessableEntityException('There was a problem creating these products');
    }
  }

  async getProducts(businessId: string, submissionId?: string) {
    const findOptions = {
      where: {
        business: { id: businessId },
      },
      relations: ['locations'],
    };
    if (submissionId) {
      findOptions.where['productUploadId'] = submissionId;
    }
    const products = await this.productRepository.find(findOptions);
    products.forEach((product: any) => {
      if (Array.isArray(product.ingredients)) {
        product.ingredients = product.ingredients.join(',');
      }
    });
    return products;
  }

  async getLocationIdsForProducts(productIds: string[]): Promise<string[]> {
    if (productIds.length === 0) { return [] };
    // we only need one product to know which locations this product list applies to
    const db = getConnectionManager().get();
    const locationProducts = await db.query(`SELECT * FROM location_products_product WHERE "productId" = '${productIds[0]}'`);
    return locationProducts.map(lp => lp.locationId);
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
      if (!productsDictionary[lp.productId]) {
        return lpDict;
      }
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

  async getProductSubmissions(businessId: string): Promise<ProductUploadRO[]> {
    const products = await this.productRepository.find({ where: { business: { id: businessId } }, order: { created_at: 'DESC' } });
    const productsBySubmissionId: Record<string, { productCount: number, dateSubmitted: string }> = products.reduce((dict, product) => {
      if (dict[product.productUploadId]) {
        dict[product.productUploadId].productCount += 1;
      } else {
        dict[product.productUploadId] = {
          productCount: 1,
          dateSubmitted: moment(product.created_at).startOf('minute').format(),
        };
      }
      return dict;
    }, {});
    const submissions = Object.keys(productsBySubmissionId).map(key => {
      return {
        productUploadId: key,
        productCount: productsBySubmissionId[key].productCount,
        dateSubmitted: productsBySubmissionId[key].dateSubmitted,
      };
    });
    return submissions;
  }

  async deleteProductSubmissions(businessId: string, productUploadId: string): Promise<void> {
    const products = await this.productRepository.softDelete({ business: { id: businessId }, productUploadId });
    return;
  }

  async assignProductsToNewBusiness(currentBusinessId: string, newBusinessId: string){
    const result = await this.productRepository
    .query(`UPDATE product SET "businessId" = $1 WHERE "businessId" = $2`, [newBusinessId, currentBusinessId])
    return result;
  }

  async getPaginatedProductsForLocation(locationId: string, query: PaginatedProductQuery): Promise<[ProductEntity[], number]>{
    const qb = this.productRepository.createQueryBuilder('product');

    qb.leftJoin('product.locations', 'locations')
    .where('locations.id = :locationId', { locationId })
    .orderBy('product.created_at');

    if(query?.perPage && query.page){
      qb.offset((query.page - 1) * query.perPage);
      qb.limit(query.perPage);
    }

    return await qb.getManyAndCount();
  }
}
