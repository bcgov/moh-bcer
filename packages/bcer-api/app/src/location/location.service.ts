import { Repository, In, Not, IsNull, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import JSZip from 'jszip';
import moment from 'moment';

import { BusinessEntity } from 'src/business/entities/business.entity';
import { haTranslation } from 'src/business/enums/health-authority.enum'
import { LocationDTO } from 'src/location/dto/location.dto';
import { LocationEntity } from 'src/location/entities/location.entity';
import { LocationSearchDTO } from 'src/location/dto/locationSearch.dto';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { QuerySaleDTO } from 'src/sales/dto/query-sale.dto';
import { getSalesReportYear } from 'src/common/common.utils';
import { convertNullToEmptyString } from 'src/utils/util';
import { NoiEntity } from 'src/noi/entities/noi.entity';
import { NoiStatus } from 'src/noi/enums/status.enum';
import { CronConfig } from 'src/cron/config/cron.config';
import { LocationStatus } from './enums/location-status.enum';

const manufacturingLocationDictionary = {
  'true': true,
  'yes': true,
  'y': true,
  '1': true,
  'false': false,
  'no': false,
  'n': false,
  '0': false
}

const manufacturingLocationTranslation = (manufacturing: string): boolean => {
  if (typeof (manufacturing) === 'boolean') return manufacturing;
  return manufacturingLocationDictionary[manufacturing];
}

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
  ) { }

  async createLocations(dto: [LocationDTO], businessId: string) {
    const business = await this.businessRepository.findOne(businessId);
    const locationEntities = this.locationRepository.create(this.mapLocationDTOs(dto, business));
    await this.locationRepository.save(locationEntities);
    const locations = await this.locationRepository.createQueryBuilder('location')
      .leftJoinAndSelect('location.business', 'business')
      .where('business.id = :businessId', { businessId })
      .getMany();
    return locations;
  }

  async getCommonLocations(query: LocationSearchDTO) {
    const possibleRelations = new Set(['business', 'noi', 'products', 'manufactures']);
    const qb = this.locationRepository.createQueryBuilder('location');
    let relations = [];
    if (query.includes) {
      relations = query.includes.split(',');
      relations.forEach((relation) => {
        if (!possibleRelations.has(relation)) throw new ForbiddenException(`Relation ${relation} not allowed`);
        qb.leftJoinAndSelect(`location.${relation}`, relation);
      });
    }
    if (!relations.includes('noi')) {
      qb.leftJoinAndSelect('location.noi', 'noi');
    } else if (!relations.includes('business') && query.orderBy === 'Business Legal Name') {
      qb.leftJoinAndSelect('location.business', 'business');
    }

    // TypeORM wonkiness: https://github.com/typeorm/typeorm/issues/3501
    if (query.orderBy === 'Submitted Date') {
      qb.orderBy(`"noi"."created_at"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Business Legal Name') {
      qb.orderBy('LOWER("business"."legalName")', query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Health Authority') {
      qb.orderBy(`"location"."health_authority"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Doing Business As') {
      qb.orderBy(`"location"."doingBusinessAs"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    }
    qb.where('location.noi IS NOT NULL');

    if (query.search) {
      qb.andWhere('(LOWER(location.addressLine1) LIKE :search OR LOWER(location.doingBusinessAs) LIKE :search OR LOWER(business.legalName) LIKE :search OR LOWER(business.businessName) LIKE :search)', { search: `%${query.search.toLowerCase()}%` });
    }
    if (query.authority) {
      qb.andWhere(`location.health_authority = :authority`, { authority: query.authority });
    }

    // TYPEORM wonkiness: Skip and Take broken here, but offset and limit may not be ideal?
    qb.offset((query.page - 1) * query.numPerPage);
    qb.limit(query.numPerPage);
    return await qb.getManyAndCount();
  }

  async getLocation(locationId: string, includes?: string) {
    let relations = [];
    if (includes) {
      relations = includes.split(',');
    }
    const location = await this.locationRepository.findOne(locationId, { relations });
    return location;
  }

  async getBusinessLocations(businessId: string, includes?: string, count?: string) {
    const locationsQb = this.locationRepository.createQueryBuilder('location');
    locationsQb.andWhere('location.businessId = :businessId', { businessId });
    if (includes && includes.length > 0) {
      includes.split(',').forEach((include) => {
        if (!['business', 'noi', 'products', 'manufactures', 'sales'].includes(include)) {
          throw new ForbiddenException('Invalid includes');
        }
        locationsQb.leftJoinAndSelect(`location.${include}`, include);
      });
    }
    if (count && count.length > 0) {
      count.split(',').forEach((colToCount) => {
        if (!['products', 'manufactures', 'sales'].includes(colToCount)) {
          throw new ForbiddenException('Invalid count');
        }
        locationsQb.addSelect((subQuery) => this.buildCountSubquery(colToCount, subQuery), `${colToCount}Count`);
        locationsQb.loadRelationCountAndMap('location.productsCount', 'location.products');
      });
    }
    const locations = await locationsQb.getMany();
    return locations;
  }

  async clearLocations() {
    await this.locationRepository.delete({});
    return;
  }

  async getLocationWithIds(locationIds?: string[], search?: string, authority?: string): Promise<LocationEntity[]> {
    const locationsQb = this.locationRepository.createQueryBuilder('location');
    locationsQb.leftJoinAndSelect('location.business', 'business');
    locationsQb.leftJoinAndSelect('location.noi', 'noi');
    if (locationIds?.length > 0) locationsQb.andWhere('location.id IN (:...locationIds)', { locationIds });
    if (search) {
      locationsQb.andWhere('(LOWER(location.addressLine1) LIKE :search OR LOWER(location.doingBusinessAs) LIKE :search OR LOWER(business.legalName) LIKE :search OR LOWER(business.businessName) LIKE :search)', { search: `%${search.toLowerCase()}%` });
    }
    if (authority) {
      locationsQb.andWhere(`location.health_authority = :authority`, { authority });
    }
    locationsQb.andWhere('location."noiId" IS NOT NULL');
    const locations = await locationsQb.getMany();

    const noisDictionary = locations.reduce((dict, location) => {
      dict[location.id] = location.noi;
      return dict;
    }, {});
    return locations.map((location) => {
      location.noi = noisDictionary[location.id];
      return location;
    });
  }

  private mapLocationDTOs(dto: LocationDTO[], business: BusinessEntity): Partial<LocationEntity>[] {
    return dto.map((l) => {
      const { health_authority, underage, underage_other, manufacturing, doingBusinessAs, ...rest } = l;
      const entity: Partial<LocationEntity> = rest;
      if (l.underage === 'other') {
        entity.underage = l.underage_other || l.underage;
      } else {
        entity.underage = l.underage;
      }
      entity.manufacturing = manufacturingLocationTranslation(l.manufacturing.toLowerCase());
      entity.ha = haTranslation(l.health_authority);
      entity.business = business;
      entity.doingBusinessAs = doingBusinessAs?.length > 0 ? doingBusinessAs : business.businessName;
      return entity;
    });
  }

  public packageAsZip(locations: LocationEntity[]): NodeJS.ReadableStream {
    let zip = new JSZip()
    const noiHeaders = 'Business Name,Business Legal Name,Address,Address 2,Postal Code,City,Buiness Email,Phone Number,Underage Permitted,Health Authority,Doing Business As,Manufacturing,Submitted Date\n';
    const productHeaders = 'Type,Brand Name,Product Name,Manufacturer Name,Manufacturer Contact,Manufacturer Address,Manufacturer Phone,Manufacturer Email,Concentration (mg/mL),Container Capacity,Cartridge Capacity,Ingredients,Flavour\n';
    const manufacturesHeaders = 'Ingredient Name,Scientific Name,Manufacturer Name,Manufacturer Address,Manufacturer Phone,Manufacturer Email\n';

    zip.folder('Locations');

    locations.map(location => {
      const noiRow = `"${location.business.businessName}","${location.business.legalName}","${location.addressLine1}","${location.addressLine2}","${location.postal}","${location.city}","${location.email}","${location.phone}","${location.underage}","${location.ha}","${location.doingBusinessAs}","${location.manufacturing}","${moment(location.noi.created_at).format('ll')}"\n`;
      let productRows = '';

      zip.folder(`Locations/${location.business.businessName} - ${location.addressLine1}`)
        .file('Noi.csv', noiHeaders + noiRow);

      if (location.products?.length) {
        location.products.map(product => {
          productRows += `"${product.type}","${product.brandName}","${product.productName}","${product.manufacturerName}","${product.manufacturerContact}","${product.manufacturerAddress}","${product.manufacturerPhone}","${product.manufacturerEmail}","${product.concentration}","${product.containerCapacity}","${product.cartridgeCapacity}","${product.ingredients}","${product.flavour}"\n`
        });
        zip.folder(`Locations/${location.business.businessName} - ${location.addressLine1}/Product Report`)
          .file(`ProductReport.csv`, productHeaders + productRows);
      }

      if (location.manufactures?.length) {
        location.manufactures.map((report) => {
          let reportRows = '';
          report.ingredients.map((ingredient) => {
            reportRows += `"${ingredient.name}","${ingredient.scientificName}","${ingredient.manufacturerName}","${ingredient.manufacturerAddress}","${ingredient.manufacturerPhone}","${ingredient.manufacturerEmail}"\n`;
          });
          zip.folder(`Locations/${location.business.businessName} - ${location.addressLine1}/Manufacturing Reports`)
            .file(`${report.productName}.csv`, manufacturesHeaders + reportRows);
        });
      }
    })

    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .on('finish', () => {
        Logger.log('zip written.');
      }
      )
  }

  public packageOnlyNOI(locations: LocationEntity[]): NodeJS.ReadableStream {
    let zip = new JSZip();
    const noiHeaders = 'Business Name,Business Legal Name,Address,Address 2,Postal Code,City,Buiness Email,Phone Number,Underage Permitted,Health Authority,Doing Business As,Manufacturing,Submitted Date\n';
    let noiRows = '';

    locations.map(location => {
      noiRows += `"${location.business.businessName}","${location.business.legalName}","${location.addressLine1}","${location.addressLine2}","${location.postal}","${location.city}","${location.email}","${location.phone}","${location.underage}","${location.ha}","${location.doingBusinessAs}","${location.manufacturing}","${moment(location.noi.created_at).format('ll')}"\n`
    });

    zip.file('All NOIs.csv', noiHeaders + noiRows);

    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .on('finish', () => {
        Logger.log('zip written.');
      }
    );
  }

  public packageOnlySalesReport(locations: LocationEntity[]): NodeJS.ReadableStream {
    let zip = new JSZip();
    
    locations.forEach(location => {
      this.generateLocationSalesReport(zip, location);
    })

    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .on('finish', () => {
        Logger.log('zip written.');
      }
    );
  }

  public packageSalesReport(years: { year: string }[], salesReportsByYear: any[][]): NodeJS.ReadableStream {
    let zip = new JSZip();
    
    salesReportsByYear.forEach((s, idx) => {
      this.generateSalesReportZip(zip, s, years[idx].year);
    })

    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .on('finish', () => {
        Logger.log('zip written.');
      }
    );
  }

  private generateSalesReportZip(zip: JSZip, salesReportsByYear: any[], year: string) {
    const businessHeader = 'Business Name,';
    const locationHeader = 'Health Authority,Doing Business As,Address,Underage,';
    const salesReportHeader = 'Brand Name,Product Name,Concentration (mg/mL) (optional),Container Capacity,Cartridge Capacity,Flavour,UPC (optional),Number of Containers Sold,Number of Cartridges Sold\n';

    let salesRows = '';
    salesReportsByYear.forEach(sale => {
      salesRows += `"${convertNullToEmptyString(sale['b_businessName'])}",`;
      salesRows += `"${convertNullToEmptyString(sale['l_health_authority'])}","${convertNullToEmptyString(sale['l_doingBusinessAs'])}","${convertNullToEmptyString(sale['l_addressLine1'])}, ${convertNullToEmptyString(sale['l_addressLine2'])}, ${convertNullToEmptyString(sale['l_postal'])}, ${convertNullToEmptyString(sale['l_city'])}","${convertNullToEmptyString(sale['l_underage'])}",`;
      salesRows += `"${convertNullToEmptyString(sale['p_brand_name'])}","${convertNullToEmptyString(sale['p_product_name'])}","${convertNullToEmptyString(sale['p_concentration'])}","${convertNullToEmptyString(sale['p_container_capacity'])}","${convertNullToEmptyString(sale['p_cartridge_capacity'])}","${convertNullToEmptyString(sale['p_flavour'])}","${convertNullToEmptyString(sale['p_upc'])}","${convertNullToEmptyString(sale['s_containers'])}", "${convertNullToEmptyString(sale['s_cartridges'])}"\n`;
    })

    zip
    .folder(year)
    .file(`salesreport.csv`, businessHeader + locationHeader + salesReportHeader + salesRows);
  }

  private generateLocationSalesReport(zip: JSZip, location: LocationEntity) {
    const headers = 'Brand Name,Product Name,Concentration (mg/mL) (optional),Container Capacity,Cartridge Capacity,Flavour,UPC (optional),Number of Containers Sold,Number of Cartridges Sold\n';

    if (location.sales?.length) {
      const yearsDict = location.sales.reduce((yearsDict, sale) => {
        if (yearsDict[sale.year]) {
          yearsDict[sale.year].push(sale);
        } else {
          yearsDict[sale.year] = [sale];
        }
        return yearsDict;
      }, {});

      Object.keys(yearsDict).forEach(year => {
        const yearSales = yearsDict[year];
        let salesRows = '';
        yearSales.forEach(sale => {
          salesRows += `"${convertNullToEmptyString(sale?.productSold?.brandName)}","${convertNullToEmptyString(sale?.productSold?.productName)}","${convertNullToEmptyString(sale?.productSold?.concentration)}","${convertNullToEmptyString(sale?.productSold?.containerCapacity)}","${convertNullToEmptyString(sale?.productSold?.cartridgeCapacity)}","${convertNullToEmptyString(sale?.productSold?.flavour)}","${convertNullToEmptyString(sale?.productSold?.upc)}","${convertNullToEmptyString(sale?.containers)}", "${convertNullToEmptyString(sale?.cartridges)}"\n`;
        });
        const startDate = moment(`10-01-${year}`, 'MM-DD-YYYY').format('LL');
        const endDate = moment(`09-30-${year}`, 'MM-DD-YYYY').add(1, 'year').format('LL');
        zip.folder(`Locations/${location.business.businessName} - ${location.addressLine1}/Sales Reports`)
          .file(`${startDate} - ${endDate}.csv`, headers + salesRows);
      });
    }
  }

  private buildCountSubquery = (relation: string, qb: SelectQueryBuilder<any>) => {
    if (relation === 'products') {
      return qb
        .select('COUNT(p.productId)')
        .from('location_products_product', 'p')
        .where('p.locationId = location.id');
    } else if (relation === 'manufactures') {
      return qb
        .select('COUNT(m.manufacturingId)')
        .from('location_manufactures_manufacturing', 'm')
        .where('m.locationId = location.id');
    } else if (relation === 'sales') {
      return qb
        .select('COUNT(s.id)')
        .from('salesreport', 's')
        .where('s.locationId = location.id');
    }
    throw new ForbiddenException('Forbidden relation');
  }

  /**
   * 
   */
  async getLocationsSalesReportWithCurrentYear (businessId: string, query: QuerySaleDTO) {
    const saleReportYear = getSalesReportYear();
   
    const { isSubmitted } = query;
  
    const locations = await this.locationRepository.createQueryBuilder('location')
      .leftJoinAndSelect('location.business', 'business')
      .where('business.id = :businessId', { businessId })
      .andWhere('location.noiId IS NOT NULL')
      .andWhere(qb => {
        const subQuery = qb.subQuery()
        .select('sr.locationId')
        .from(SalesReportEntity, 'sr')
        .where('sr.year = :year', { year: saleReportYear.year })
        .groupBy('sr.locationId')
        .getQuery();
        return isSubmitted ? `location.id IN ${subQuery}` : `location.id NOT IN ${subQuery}`
      })
      .getMany();
      return { ...saleReportYear, data: locations };
  }

  async closeAllLocationWithExpiredNOI(): Promise<UpdateResult>{
    const locations = await this.locationRepository
      .createQueryBuilder()
      .select('loc.id')
      .from(LocationEntity, 'loc')
      .innerJoin(NoiEntity, 'noi', 'loc.noiId = noi.id')
      .andWhere('COALESCE(noi.renewed_at, noi.created_at) < :expiryDate', {
        expiryDate: CronConfig.getNoiExpiryDate().toDate(),
      })
      .andWhere('loc.status = :active', {
        active: LocationStatus.Active,
      })
      .getMany();

    const locationIds = locations?.map(l => l.id);

    const result = await this.closeLocation(locationIds);
    return result;
  }

  /**
   * Close locations with ids
   * @param locationIds 
   * @returns 
   */
  async closeLocation(locationIds: string[], closedTime?: number): Promise<UpdateResult> {
    const result = await this.locationRepository.update(
      { id: In(locationIds) },
      { 
        status: LocationStatus.Closed,
        closedAt: moment().toDate(),
        closedTime: !!closedTime ? moment.unix(closedTime).toDate() : null,
      },
    );
    return result;
  }

  /**
   * Delete locations with ids,
   * This is a soft-delete by manipulating the location status.
   * @param locationIds 
   * @returns 
   */
     async deleteLocation(locationIds: string[]): Promise<UpdateResult> {
      const result = await this.locationRepository.softDelete({id: In(locationIds)});
      return;
    }
}
