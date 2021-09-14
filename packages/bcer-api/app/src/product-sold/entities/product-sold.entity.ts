import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
} from 'typeorm';

import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';

@Entity('product_sold')
export class ProductSoldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: true, name: 'brand_name' })
  brandName: string;

  @Column('varchar', { nullable: true, name: 'product_name' })
  productName: string;

  @Column('varchar', { nullable: true })
  concentration: string;

  @Column('varchar', { nullable: true, name: 'container_capacity' })
  containerCapacity: string;

  @Column('varchar', { nullable: true, name: 'cartridge_capacity' })
  cartridgeCapacity: string;

  @Column('varchar', { nullable: true })
  flavour: string;

  @Column('varchar', { nullable: true, unique: true })
  upc: string;

  @OneToOne(
    () => SalesReportEntity,
    (salesReport: SalesReportEntity) => salesReport.product,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  sale: SalesReportEntity;

  @ManyToOne(
    () => LocationEntity,
    (location: LocationEntity) => location.productSolds,
  )
  location: LocationEntity;

  @ManyToOne(
    () => BusinessEntity,
    (business: BusinessEntity) => business.productSolds,
  )
  @JoinColumn()
  business: BusinessEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}