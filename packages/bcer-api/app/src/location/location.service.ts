import { Repository, In, SelectQueryBuilder, UpdateResult, getConnection, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import JSZip from 'jszip';
import moment from 'moment';
import * as XLSX from "xlsx";

import { BusinessEntity } from 'src/business/entities/business.entity';
import { haTranslation } from 'src/business/enums/health-authority.enum'
import { LocationDTO } from 'src/location/dto/location.dto';
import { LocationEntity } from 'src/location/entities/location.entity';
import { LocationSearchDTO } from 'src/location/dto/locationSearch.dto';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { QuerySaleDTO } from 'src/sales/dto/query-sale.dto';
import { getNoiReportingPeriod, getSalesReportingPeriod, getSalesReportYear } from 'src/common/common.utils';
import { convertNullToEmptyString, sleep } from 'src/utils/util';
import { NoiEntity } from 'src/noi/entities/noi.entity';
import { CronConfig } from 'src/cron/config/cron.config';
import { LocationStatus } from './enums/location-status.enum';
import { GeoCodeService } from './geoCode.service';
import { GoogleGeoCodeRO } from './ro/googleGeoCode.ro';
import Axios from 'axios';
import { BusinessReportingStatusRO } from 'src/business/ro/businessReportingStatus.ro';
import { LocationReportingStatus } from './helper/locationReportStatus';
import { LocationComplianceStatus } from './helper/locationComplianceStatus';
import { BusinessReportType } from 'src/business/enums/businessReportType.enum';
import { SingleLocationComplianceStatus } from './helper/singleLocationComplianceStatus';
import { SingleLocationReportStatus } from './helper/singleLocationReportStatus';
import { LocationContactDTO } from './dto/locationContact.dto';
import { LocationType } from './enums/location_type.enum';
import { ConfigDates } from 'src/utils/configDates';
import { CONFIG } from 'src/common/common.config';
import { duplicateLocationAlertEmailService } from './duplicateLocationAlertEmailService';

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

export const manufacturingLocationTranslation = (manufacturing: string): boolean => {return manufacturingLocationDictionary[manufacturing]}

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
    @InjectRepository(SalesReportEntity)
    private readonly salesReportRepository: Repository<SalesReportEntity>,
    private geoCodeService: GeoCodeService,
    private duplicateLocationAlertEmailService: duplicateLocationAlertEmailService,
  ) { }

  async createLocations(dto: LocationDTO[], businessId: string) {
    const business = await this.businessRepository.findOne({where: { id: businessId }});
    // Filtering out any existing location
    dto = dto.filter(d => !(d as any).id);

    // if an empty or null value was passed as id during submission 
    // deleting the field to avoid uuid error in database.
    // Validation should be added in submission route
    dto = dto.map(d => {
      if(Object.keys(d).includes('id')){
        delete (d as any).id;
      }
      return d;
    })
    const locationEntities = this.locationRepository.create(this.mapLocationDTOs(dto, business));
    await this.locationRepository.save(locationEntities);
    const locations = await this.locationRepository.createQueryBuilder('location')
      .leftJoinAndSelect('location.business', 'business')
      .where('business.id = :businessId', { businessId })
      .getMany();
    return locations;
  }

  async getCommonLocations(query: LocationSearchDTO, addCount?: boolean) {
    const possibleRelations = new Set(['business', 'noi', 'products', 'manufactures', 'sales']);
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
    }  else if (query.orderBy === 'Business Name') {
      qb.orderBy('LOWER("business"."businessName")', query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Health Authority') {
      qb.orderBy(`"location"."health_authority"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Doing Business As') {
      qb.orderBy(`"location"."doingBusinessAs"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Location Type') {
      qb.orderBy(`"location"."location_type"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } else if (query.orderBy === 'Address') {
      qb.orderBy(`"location"."addressLine1"`, query.order);
      qb.addOrderBy(`"location"."webpage"`, query.order);
      qb.addOrderBy('"noi"."id"', 'ASC');
    } 
    
    if (query.search) {      
      qb.andWhere(`
        (
          regexp_replace(LOWER(location.addressLine1), '[^a-zA-Z0-9]', '', 'g') LIKE :search OR
          regexp_replace(LOWER(location.doingBusinessAs), '[^a-zA-Z0-9]', '', 'g') LIKE :search OR
          REPLACE(LOWER(location.city), ' ', '') LIKE REPLACE(:search, ' ', '') OR
          REPLACE(LOWER(location.postal), ' ', '') LIKE REPLACE(:search, ' ', '') OR
          regexp_replace(LOWER(business.legalName), '[^a-zA-Z0-9]', '', 'g') LIKE :search OR
          regexp_replace(LOWER(business.businessName), '[^a-zA-Z0-9]', '', 'g') LIKE :search          
        )
      `, { search: `%${query.search.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}%` });
    }

    if (query.authority) {
      qb.andWhere(`location.health_authority = :authority`, { authority: query.authority });
    }

    if (query.location_type) {
      qb.andWhere(`location.location_type = :location_type`, { location_type: query.location_type });
    }

    if (query.underage) {
      const underage = query.underage.toLowerCase();
      if (underage === 'yes' || underage === 'no') {
        qb.andWhere(`LOWER(location.underage) = :underage`, { underage: underage });
      } else {
        qb.andWhere(`LOWER(location.underage) <> 'yes' AND LOWER(location.underage) <> 'no'`);
      }
    }

    if (query.noi_report) {
      const { startReport, endReport } = getNoiReportingPeriod();
      const isReportingPeriod = moment().isBetween(startReport, endReport);
      
      Logger.log(`Reporting Period: ${startReport} - ${endReport}`)
      Logger.log(`Is reporting period: ${isReportingPeriod}`)

      if (query.noi_report === "Submitted") {
        if (isReportingPeriod) {
          qb.andWhere(`(location.noiId IS NOT NULL AND noi.expiry_date > :endReport) OR (location.status = :status)`, { 
            endReport: endReport.toDate(),
            status: LocationStatus.Closed
          })  
        } else {
          qb.andWhere(`(location.noiId IS NOT NULL AND noi.expiry_date > :today) OR (location.status = :status)`, { 
            today: moment().toDate(),
            status: LocationStatus.Closed
          }) 
        }  
      } else if (query.noi_report === "PendingReview") {
        if (isReportingPeriod) {
          qb.andWhere(`location.status = 'active' AND location.noiId IS NOT NULL AND date_part('year', noi.expiry_date) = :endReportYear`, { 
            endReportYear: endReport.year() 
          })  
        } 
      } else {         
        qb.andWhere("location.status = :status AND ((location.noiId IS NULL) OR (location.noiId IS NOT NULL AND noi.expiry_date < :today))", {
          status: LocationStatus.Active,
          today: moment().toDate()
        })
      }
    }

    if (query.product_report) {  
      qb.leftJoin(`location.products`, 'products');
      if (query.product_report === "Submitted") {      
        qb.andWhere(`"location_products"."locationId" IS NOT NULL`)
      } else {        
        qb.andWhere(`"location_products"."locationId" IS NULL`)
      }
    }

    if (query.manufacturing_report) {
      qb.leftJoin(`location.manufactures`, 'manufactures');
      if (query.manufacturing_report === "NotRequired") {
        qb.andWhere(`location.manufacturing = :manufacturing`, { manufacturing: false });
      } else if (query.manufacturing_report === "NotSubmitted") {
        qb.andWhere(`location.manufacturing = :manufacturing AND "location_manufactures"."locationId" IS NULL`, { manufacturing: true });
      } else {
        qb.andWhere(`location.manufacturing = :manufacturing AND "location_manufactures"."locationId" IS NOT NULL`, { manufacturing: true });
      }
    }

    if (query.sales_report) {
      const currentReportingStart = ConfigDates.getCurrentReportingStartDate();
      const previousReportingStart = moment(currentReportingStart).subtract(1, 'year');
      
      if (query.sales_report === "NotRequired") { //no noi, or noi created after this period or closed before last report(crren)
        qb.andWhere(`location.noiId IS NULL OR (noi.created_at > :startReport) OR (location.status = 'closed' AND location.closed_at < :previousReportingStart)` , {
          startReport: currentReportingStart.toDate(), 
          previousReportingStart: previousReportingStart.toDate()
        })
      } else if (query.sales_report === "NotSubmitted") { //valid noi, but no sales count for current year
        qb.andWhere(`location.noiId IS NOT NULL`)
        .andWhere('noi.created_at < :start', {start: currentReportingStart.toDate()}) 
        .andWhere(`(location.status = 'active' OR location.closed_at > :previousReportingStart)`, {
          previousReportingStart: previousReportingStart.toDate()
        })  
        .andWhere(qb => {
          const subQuery = qb.subQuery()
          .select('sr.locationId')
          .from(SalesReportEntity, 'sr')
          .where('sr.year = :year', { year: getSalesReportYear().year })
          .groupBy('sr.locationId')
          .getQuery();
          return `location.id NOT IN ${subQuery}`
        })              
      } else { 
        qb.andWhere(`location.noiId IS NOT NULL`)
        .andWhere('noi.created_at < :start', {start: currentReportingStart.toDate()}) 
        .andWhere(`(location.status = 'active' OR location.closed_at > :previousReportingStart)`, {
          previousReportingStart: previousReportingStart.toDate()
        }) 
        .andWhere(qb => {
          const subQuery = qb.subQuery()
          .select('sr.locationId')
          .from(SalesReportEntity, 'sr')
          .where('sr.year = :year', { year: getSalesReportYear().year })
          .groupBy('sr.locationId')
          .getQuery();
          return `location.id IN ${subQuery}`
        })
      }
    }

    //date filter for submitted locations 
    if (query.fromdate && query.todate){
      qb.andWhere(`location.created_at between :fromdate and :todate`, { fromdate: query.fromdate, todate: query.todate});
    } else if (query.fromdate) {
      qb.andWhere(`location.created_at >= :fromdate`, { fromdate: query.fromdate });
    } else if (query.todate) {
      qb.andWhere(`location.created_at <= :todate`, { todate: query.todate });
    }

    // Counting the number of submitted reports
    if(addCount) {            
      ['products', 'manufactures', 'sales'].forEach((colToCount) => {
        if (colToCount === "sales") 
          qb.loadRelationCountAndMap(`location.${colToCount}Count`, `location.${colToCount}`, 'sales', (qb) => qb.where(`sales.year = :year`, {year: getSalesReportYear().year}));
        else 
          qb.loadRelationCountAndMap(`location.${colToCount}Count`, `location.${colToCount}`);
      })
    }

    // TYPEORM wonkiness: Skip and Take broken here, but offset and limit may not be ideal?
    qb.offset((query.page - 1) * query.numPerPage);

    if (!query.all) 
      qb.limit(query.numPerPage);

    Logger.log(qb.getQueryAndParameters())

    return await qb.getManyAndCount();
  }

  async getLocation(locationId: string, includes?: string) {
    let relations = [];
    if (includes) {
      relations = includes.split(',');
    }
    const location = await this.locationRepository.findOne({ where: { id: locationId }, relations: relations });
    return location;
  }

  async getLocationDespiteDeletion(locationId: string, includes?: string) {
    let relations = [];
    if (includes) {
      relations = includes.split(',');
    }
    const location = await this.locationRepository.findOne({where: { id: locationId }, relations: relations, withDeleted: true});
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
        locationsQb.loadRelationCountAndMap(`location.${colToCount}Count`, `location.${colToCount}`);
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
  
    if (locationIds && locationIds.length > 0) {
      locationsQb.andWhere('location.id IN (:...ids)', { ids: locationIds });
    }
  
    if (search) {
      locationsQb.andWhere('(LOWER(location.addressLine1) LIKE :search OR LOWER(location.doingBusinessAs) LIKE :search OR LOWER(business.legalName) LIKE :search OR LOWER(business.businessName) LIKE :search)', { search: `%${search.toLowerCase()}%` });
    }
    if (authority) {
      locationsQb.andWhere('location.health_authority = :authority', { authority });
    }
    //locationsQb.andWhere('location."noiId" IS NOT NULL');
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
      const { health_authority, underage, underage_other, manufacturing, doingBusinessAs, location_type, ...rest } = l;
      const entity: Partial<LocationEntity> = rest;
      if (l.underage === 'other') {
        entity.underage = l.underage_other || l.underage;
      } else {
        entity.underage = l.underage;
      }
      entity.manufacturing = manufacturingLocationTranslation(l.manufacturing.toLowerCase());
      entity.ha = haTranslation(l.health_authority);
      entity.ha_other = l.health_authority_other;
      entity.business = business;
      entity.doingBusinessAs = doingBusinessAs?.length > 0 ? doingBusinessAs : business.businessName;
      entity.webpage = l.webpage;
      entity.location_type = l.location_type as LocationType;

      return entity;
    });
  }

  public packageAsZip(locations: LocationEntity[]): NodeJS.ReadableStream {
    let zip = new JSZip();

    let noiHeader = ['Business Name', 'Business Legal Name', 'Address', 'Address 2', 'Postal Code', 'City', 'Buiness Email', 'Phone Number', 'Underage Permitted',
          'Health Authority','Doing Business As','Manufacturing','Submitted Date','Renewed Date']

    let productReportHeader = ['Type', 'Brand Name',' Product Name', 'Manufacturer Name', 'Manufacturer Contact', 'Manufacturer Address', 'Manufacturer Phone', 'Manufacturer Email',
        'Concentration (mg/mL)',' Container Capacity',' Cartridge Capacity',' Ingredients', 'Flavour']

    let manufacturingReportHeader = ['Ingredient Name', 'Scientific Name', 'Manufacturer Name', 'Manufacturer Address', 'Manufacturer Phone',' Manufacturer Email']
    
    let index = 1;

    locations.map(location => {
      const fileName = `${index} - ${location.business.businessName} - ${location.addressLine1} `;
      const workBook = XLSX.utils.book_new();  

      if (location.noi.created_at) {
        const noi = [noiHeader];
        noi.push([location.business.businessName, location.business.legalName, location.addressLine1, location.addressLine2, location.postal, location.city, location.email,
            location.phone, location.underage, location.ha, location.doingBusinessAs, location.manufacturing.toString(), moment(location.noi.created_at).format('ll'),
            location.noi.renewed_at? moment(location.noi.renewed_at).format('ll'): ''
        ])

        const noiWorkSheet = XLSX.utils.aoa_to_sheet(noi);
        XLSX.utils.book_append_sheet(workBook, noiWorkSheet, 'NOI');
      }

      if (location.products?.length) {
        let productReport = [productReportHeader];
        location.products.map(product => {
          productReport.push([product.type, product.brandName, product.productName, product.manufacturerName, product.manufacturerContact, product.manufacturerAddress, product.manufacturerPhone, 
            product.manufacturerEmail, product.concentration, product.containerCapacity, product.cartridgeCapacity, product.ingredients, product.flavour])
        });
        const productReportWorkSheet = XLSX.utils.aoa_to_sheet(productReport);
        XLSX.utils.book_append_sheet(workBook, productReportWorkSheet, 'Product Report');
      }

      if (location.manufactures?.length) {
        let manufacturingReport = [manufacturingReportHeader];
        location.manufactures.map((report) => {
          report && report.ingredients && report.ingredients.map((ingredient) => {
            manufacturingReport.push([ingredient.name, ingredient.scientificName, ingredient.manufacturerName, ingredient.manufacturerAddress, ingredient.manufacturerPhone, ingredient.manufacturerEmail])
          });          
        });
        const manufacturingReportWorkSheet = XLSX.utils.aoa_to_sheet(manufacturingReport);
        XLSX.utils.book_append_sheet(workBook, manufacturingReportWorkSheet, 'Manufacturing Report');
      }

      const workBookBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });      
      zip.file(`${fileName}.xlsx`, workBookBuffer);
      index++;
    })
    
    return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .on('finish', () => {
        Logger.log('zip written.');
      }
      )
  }

  public packageOnlyNOI(locations: LocationEntity[]): NodeJS.ReadableStream {
    let zip = new JSZip();
    const noiHeaders = 'Business Name,Business Legal Name,Address,Address 2,Postal Code,City,Buiness Email,Phone Number,Underage Permitted,Health Authority,Doing Business As,Manufacturing,Submitted Date,Renewed Date\n';
    let noiRows = '';

    locations.forEach(location => {
      const submittedDate = location.noi && location.noi.created_at ? moment(location.noi.created_at).format('ll') : '';
      const renewedDate = location.noi && location.noi.renewed_at ? moment(location.noi.renewed_at).format('ll') : '';

      noiRows += `"${location.business.businessName}","${location.business.legalName}","${location.addressLine1}","${location.addressLine2}","${location.postal}","${location.city}","${location.email}","${location.phone}","${location.underage}","${location.ha}","${location.doingBusinessAs}","${location.manufacturing}","${submittedDate}","${renewedDate}"\n`;
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
    const {startReport, endReport} = getSalesReportingPeriod();
   
    const { isSubmitted } = query;
  
    const locations = await this.locationRepository.createQueryBuilder('location')
      .leftJoinAndSelect('location.business', 'business')
      .leftJoin('location.noi', 'noi')
      .where('business.id = :businessId', { businessId })
      .andWhere('location.noiId IS NOT NULL')
      .andWhere('noi.created_at NOT BETWEEN :start AND :end', {start: startReport, end: endReport})
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
   */
  async deleteLocation(locationIds: string[]){
    const result = await this.locationRepository.softDelete({id: In(locationIds)});
  }

  /**
 * Delete locations with ids,
 * This is a hard delete by location ID, fully removing the location and associated resources
 * @param locationIds 
 */
    async hardDeleteLocation(location: LocationEntity): Promise<void>{
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const locationId = location.id;

    await queryRunner.startTransaction();
    try {

      await queryRunner.manager.delete('location_manufactures_manufacturing', { locationId });
      await queryRunner.manager.delete('location_products_product', { locationId });
      await queryRunner.manager.delete('salesreport', { locationId });
      await queryRunner.manager.delete('product_sold', { location });
      await queryRunner.manager.delete('note', { location });
      await queryRunner.manager.delete('location', { id: locationId });
      await queryRunner.manager.delete('noi', { id: location.noi.id });

      await queryRunner.commitTransaction();
    } catch (err) {
      Logger.error(err)
      // rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw  `Cannot delete location ${location.doingBusinessAs} with id  ${locationId}`;
    } finally {
          
      // release queryRunner
        await queryRunner.release();
    }
  }

  /**
   * Update a location
   * @param locationId
   */
  async updateLocation(locationId: string, payload: LocationDTO){
    let updateValue = {
      email: payload.email,
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      postal: payload.postal,
      city: payload.city,
      phone: payload.phone,
      webpage: payload.webpage,
      doingBusinessAs: payload.doingBusinessAs,
      underage: payload.underage,
      ha: haTranslation(payload.health_authority),
      ha_other: payload.health_authority_other,
      manufacturing: payload.manufacturing === "yes" ? true : false,
      location_type:payload.location_type as LocationType,
    }
    payload.underage === "other" ? updateValue.underage = payload.underage_other : null;
    payload.latitude ? updateValue['latitude'] = payload.latitude : null;
    payload.longitude ? updateValue['longitude'] = payload.longitude : null;
    payload.geoAddressConfidence ? updateValue['geoAddressConfidence'] = payload.geoAddressConfidence : null;
    const result = await this.locationRepository.update(
      { id: locationId },
      { ...updateValue}
    );
  }

  /**
   * Get all location for a business
   * @param businessId
   * @reutrns
   */
  async getLocationsWithBusinessId(businessId: string){
    return await this.locationRepository.find({ where: { businessId: businessId } });

  }

  async assignLocationsToNewBusiness(currentBusinessId: string, newBusinessId: string){
    const result = await this.locationRepository
    .createQueryBuilder()
    .update()
    .set({businessId: newBusinessId})
    .where('businessId = :currentBusinessId', {currentBusinessId})
    .execute();
  }

  async updateLocationGeoCode(locationId: string, payload: GoogleGeoCodeRO){
    await this.locationRepository
      .createQueryBuilder()
      .update()
      .set({ ...payload })
      .where('id = :locationId', { locationId })
      .execute();

    return await this.getLocation(locationId);
  }

  async getLocationGeoCode(locationId: string, location?: LocationEntity): Promise<GoogleGeoCodeRO> {
    if(!location){
      location = await this.getLocation(locationId);
    }
    const formattedAddress = this.formatFullAddress(location);
    return await this.geoCodeService.getGeoCode(formattedAddress);
  }

  formatFullAddress(location: LocationEntity){
    return location ? `${location.addressLine1}, ${location.city}, ${location.postal || ''}` : '';
  }

  async getLocationsWithoutGeoCode(): Promise<LocationEntity[]> {
    return await this.locationRepository.find({ where: { geoAddressConfidence: null }});
  }

  async updateGeoCodeForExistingLocations() {
    const locations = await this.getLocationsWithoutGeoCode();
    const result = await (Promise as any).allSettled(locations.map(async (location, index) => {
      // To maintain the api limit of 50 requests per second
      await sleep(Math.floor(index / 50) * 1000);
      
      const geoCode = await this.getLocationGeoCode(location.id, location);
      return this.updateLocationGeoCode(location.id, geoCode);
    }));

    const report = {
      total: locations.length,
      success: 0,
      fail: 0
    }

    result?.forEach((r) => {
      if(r?.status === 'fulfilled') report.success++;
      else report.fail++
    })
    return report;
  }

  async getDirection(uri: string) {
    const baseLink = 'https://router.api.gov.bc.ca';
    const { data } = await Axios.get(`${baseLink}${uri}`, {
      headers: {
        apiKey: process.env.BC_DIRECTION_API_KEY,
      },
    });
    return data;
  }

  async getLocationWithIdsForABusiness(locationIds: string[], businessId: string){
    const locationsQb = this.locationRepository.createQueryBuilder('location');
    locationsQb.leftJoinAndSelect('location.business', 'business')
      .leftJoinAndSelect('location.noi', 'noi')
      .andWhere('location.id IN (:...locationIds)', { locationIds })
      .andWhere('location."noiId" IS NOT NULL')
      .andWhere('business.id = :businessId', { businessId });

    return await locationsQb.getMany();
  }
  
  async getDownloadCSV(locationId: string, year: string) {
    const salesReports = await this.salesReportRepository.find({
      where: {
        locationId,
        year,
      },
      relations: ['productSold'],
    });
    return salesReports.map(s => {
      const { productSold: p } = s;
      return [
        p.brandName,
        p.productName,
        p.concentration,
        p.containerCapacity,
        p.cartridgeCapacity,
        p.flavour,
        p.upc,
        s.containers,
        s.cartridges,
      ];
    });
  }

  checkLocationReportComplete(
    locations: LocationEntity[],
    options?: { exitEarly?: boolean; type?: BusinessReportType },
  ): BusinessReportingStatusRO {
    const { exitEarly, type = BusinessReportType.Report } = options || {};
    
    const status =
      type === BusinessReportType.Report
        ? new LocationReportingStatus(locations, exitEarly)
        : new LocationComplianceStatus(locations, exitEarly);

    return status
      .check()
      .build()
  }

  async getReportingStatus(businessId: string, type?: BusinessReportType){
    const locations = await this.getBusinessLocations(businessId, 'noi', 'products,manufactures,sales');
    
    const reportingOverview = this.checkLocationReportComplete(locations, {type: type});
    
    const locationsRO = locations.map((l) => {
      let status = (type === BusinessReportType.Compliance ? new SingleLocationComplianceStatus() : new SingleLocationReportStatus());
      l.reportStatus = status.getStatus(l);
      return l.toResponseObject();
    })

    return {locations: locationsRO, overview: reportingOverview}
  }

  async updateMultipleLocationContactInfo(payload: LocationContactDTO, businessId: string) {
    return await this.locationRepository.update(
      { id: In(payload.ids), businessId }, 
      {
        phone: payload.phone, 
        email: payload.email
      }
    )
  }
  
  async getLocationReportingStatus(id: string) {
    const qb = this.locationRepository.createQueryBuilder('location')
     .leftJoinAndSelect('location.noi', 'noi');

    ['products', 'manufactures', 'sales'].forEach(colToCount => {
      if (colToCount === "sales") 
        qb.loadRelationCountAndMap(`location.${colToCount}Count`, `location.${colToCount}`, 'sales', (qb) => qb.where(`sales.year = :year`, {year: getSalesReportYear().year}));
      else 
      qb.loadRelationCountAndMap(`location.${colToCount}Count`, `location.${colToCount}`);
    })

    qb.where('location.id = :id', { id });

    const location = await qb.getOne();
    return new SingleLocationReportStatus().getStatus(location);
  }

  /**
 * transfer a location to another business
 * @param locationId 
 * @returns 
 */
  async transferLocation(locationId: string, businessId: string): Promise<UpdateResult> {
    return await this.locationRepository.update(
      { id: locationId},
      { 
        businessId: businessId,
      },
    );
  }

  /**
 * Check if location address exists when a user add a new location
 * @param fullAddress 
 * @returns 
 */
  async checkAddressExists(fullAddress: string): Promise<boolean> {
    const existingLocation = await this.locationRepository.findOne({ where: {addressLine1: ILike(`%${fullAddress}%`)}});
    return !!existingLocation;
  }

  /**
 * Send email to the retailer and vapingInfo mailbox when new duplicate location(s) are created
 * @param dataForContext 
 * @returns 
 */
  async sendEmailNotification(dataForContext: any): Promise<boolean> {
    return await this.duplicateLocationAlertEmailService.sendEmailNotification(dataForContext)
  }
}
