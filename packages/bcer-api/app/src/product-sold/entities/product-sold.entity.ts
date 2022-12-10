import {
  Entity,
  PrimaryColumn,
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
import { ProductSoldRO } from '../ro/product-sold.ro';

@Entity('product_sold')
export class ProductSoldEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
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

  @Column('varchar', { nullable: true })
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

  toResponseObject(): ProductSoldRO {
    return {
      id: this.id,
      brandName: this.brandName,
      productName: this.productName,
      concentration: this.concentration,
      containerCapacity: this.containerCapacity,
      cartridgeCapacity: this.cartridgeCapacity,
      flavour: this.flavour,
      upc: this.upc,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
    }
  }
}
