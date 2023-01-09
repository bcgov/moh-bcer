import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Generated
} from 'typeorm';

import { LocationEntity } from 'src/location/entities/location.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { SalesReportRO } from 'src/sales/ro/sales.ro';
import { ProductSoldEntity } from 'src/product-sold/entities/product-sold.entity';

@Entity('salesreport')
export class SalesReportEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
  @Generated()
  id: string;

  @ManyToOne(
    () => ProductEntity,
    (product: ProductEntity) => product.sales,
  )
  @JoinColumn()
  product: ProductEntity;

  @OneToOne(
    () => ProductSoldEntity,
    (productSold: ProductSoldEntity) => productSold.sale,
  )
  @JoinColumn()
  productSold: ProductSoldEntity;

  @Column('varchar', { nullable: true })
  productId?: string;

  @ManyToOne(
    () => LocationEntity,
    (location: LocationEntity) => location.sales,
  )
  @JoinColumn()
  location: LocationEntity;

  @Column('varchar')
  locationId?: string;

  @Column('varchar', { nullable: true })
  containers: string;

  @Column('varchar', { nullable: true })
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
      productSold: this.productSold?.toResponseObject(),
    };
  }
}
