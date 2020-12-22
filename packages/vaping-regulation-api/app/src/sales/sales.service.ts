import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SaleDTO } from './dto/sale.dto';
import { SalesReportDTO } from './dto/sales.dto';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { SalesReportRO } from './ro/sales.ro';

@Injectable()
export class SalesReportService {
  constructor(
  @InjectRepository(SalesReportEntity)
    private readonly salesReportRepository: Repository<SalesReportEntity>,
  ) {}

  async createSalesReports(dto: SalesReportDTO): Promise<SalesReportRO[]> {
    const sales = await this.salesReportRepository.create(dto.sales.map((sales: SaleDTO) => ({
      ...sales, 
      product: { id: sales.productId }, 
      location: { id: sales.locationId }
    })));
    await this.salesReportRepository.save(sales);

    return sales;
  }

  async getSalesReportsWithIds(salesIds: string[]): Promise<SalesReportEntity[]> {
    if (salesIds.length === 0) return [];
    const sales = await this.salesReportRepository.find({
      where: {
        id: In(salesIds),
      }, relations: ['product'],
    });
    return sales;
  }
  
  async getSalesReports() {
    const sales = await this.salesReportRepository.find();
    return sales;
  }
}
