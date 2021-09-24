import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SaleDTO } from './dto/sale.dto';
import { SalesReportDTO } from './dto/sales.dto';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { SalesReportRO } from './ro/sales.ro';
import { SaleProductSoldDTO } from './dto/sale-product-sold.dto';
import { ProductSoldEntity } from 'src/product-sold/entities/product-sold.entity';
import { LocationEntity } from 'src/location/entities/location.entity';

@Injectable()
export class SalesReportService {
  constructor(
    @InjectRepository(SalesReportEntity)
    private readonly salesReportRepository: Repository<SalesReportEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async createSalesReports(dto: SalesReportDTO): Promise<SalesReportRO[]> {
    const sales = await this.salesReportRepository.create(
      dto.sales.map((sales: SaleDTO) => ({
        ...sales,
        product: { id: sales.productId },
        location: { id: sales.locationId },
      })),
    );
    await this.salesReportRepository.save(sales);

    return sales;
  }

  async getSalesReportsWithIds(
    salesIds: string[],
  ): Promise<SalesReportEntity[]> {
    if (salesIds.length === 0) return [];
    const sales = await this.salesReportRepository.find({
      where: {
        id: In(salesIds),
      },
      relations: ['product'],
    });
    return sales;
  }

  async getLocationsWithSalesReports(
    locationIds: string[],
  ): Promise<Record<string, SalesReportEntity[]>> {
    if (locationIds.length === 0) return {};
    const sales = await this.salesReportRepository.find({
      where: {
        locationId: In(locationIds),
      },
    });

    const locationWithSales = sales.reduce((dict, sale) => {
      if (!!dict[sale.locationId]) {
        dict[sale.locationId].push(sale);
      } else {
        dict[sale.locationId] = [sale];
      }
      return dict;
    }, {});

    return locationWithSales;
  }

  async getSalesReports() {
    const sales = await this.salesReportRepository.find();
    return sales;
  }

  async createSalesReportsBySubmission(
    locationId: string,
    year: string,
    saleProductSoldsDTO: SaleProductSoldDTO[],
    productSolds: ProductSoldEntity[],
  ) {
    let saleReports = this.salesReportRepository.create(saleProductSoldsDTO);

    saleReports = saleReports.map((sp, idx) => {
      sp.year = year;
      sp.productSold = productSolds[idx];
      sp.locationId = locationId;
      return sp;
    });
    return await this.salesReportRepository.save(saleReports, { chunk: 500 });
  }

  async remove(locationId: string, year: string) {
    const deleteProductSolds = await this.salesReportRepository
      .createQueryBuilder('salesreport')
      .leftJoinAndSelect('salesreport.location', 'location')
      .leftJoinAndSelect('salesreport.productSold', 'productSold')
      .select('productSold.id', 'id')
      .where('location.id = :locationId', { locationId })
      .andWhere('salesreport.year = :year', { year })
      .execute();

    await this.salesReportRepository
      .createQueryBuilder('salesreport')
      .leftJoinAndSelect('salesreport.location', 'location')
      .where('location.id = :locationId', { locationId })
      .andWhere('salesreport.year = :year', { year })
      .delete()
      .execute();

    return deleteProductSolds;
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
}
