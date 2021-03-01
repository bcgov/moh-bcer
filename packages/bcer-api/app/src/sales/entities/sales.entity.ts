import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { LocationEntity } from 'src/location/entities/location.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { SalesReportRO } from 'src/sales/ro/sales.ro';

@Entity('salesreport')
export class SalesReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product: ProductEntity) => product.sales)
  @JoinColumn()
  product: ProductEntity;

  @Column('varchar')
  productId?: string;

  @ManyToOne(() => LocationEntity, (location: LocationEntity) => location.sales)
  @JoinColumn()
  location: ProductEntity;

  @Column('varchar')
  locationId?: string;

  @Column('varchar')
  containers: string;

  @Column('varchar')
  cartridges: string;

  @Column('varchar')
  year: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toResponseObject(): SalesReportRO {
    return {
      id: this.id,
      containers: this.containers,
      cartridges: this.cartridges,
      year: this.year,
      product: this.product?.toResponseObject(),
    };
  }
}
