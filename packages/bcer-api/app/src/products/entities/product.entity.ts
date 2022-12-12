import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
  Generated
} from 'typeorm';

import { ProductRO } from 'src/products/ro/product.ro';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
  @Generated()
  id: string;

  @Column('varchar', { nullable: true })
  type: string;

  @Column('varchar', { nullable: true })
  brandName: string;

  @Column('varchar', { nullable: true })
  productName: string;

  @Column('varchar', { nullable: true })
  manufacturerName: string;

  @Column('varchar', { nullable: true })
  manufacturerAddress: string;

  @Column('varchar', { nullable: true })
  manufacturerPhone: string;

  @Column('varchar', { nullable: true })
  manufacturerEmail: string;

  @Column('varchar', { nullable: true })
  manufacturerContact: string;

  @Column('varchar', { nullable: true })
  concentration: string;

  @Column('varchar', { nullable: true })
  containerCapacity: string;

  @Column('varchar', { nullable: true })
  cartridgeCapacity: string;

  @Column('varchar', { nullable: true })
  ingredients: string;

  @Column('varchar', { nullable: true })
  flavour: string;

  @Index()
  @Column('uuid', { nullable: true })
  productUploadId: string;

  @OneToMany(() => SalesReportEntity, (salesReport: SalesReportEntity) => salesReport.product)
  sales: SalesReportEntity[];

  @ManyToMany(() => LocationEntity, (location: LocationEntity) => location.products)
  locations: LocationEntity[];

  @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.products)
  @JoinColumn()
  business: BusinessEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  toResponseObject(): ProductRO {
    return {
      id: this.id,
      type: this.type,
      brandName: this.brandName,
      productName: this.productName,
      manufacturerName: this.manufacturerName,
      manufacturerAddress: this.manufacturerAddress,
      manufacturerPhone: this.manufacturerPhone,
      manufacturerEmail: this.manufacturerEmail,
      manufacturerContact: this.manufacturerContact,
      concentration: this.concentration,
      containerCapacity: this.containerCapacity,
      cartridgeCapacity: this.cartridgeCapacity,
      ingredients: this.ingredients,
      flavour: this.flavour,
      locationIds: this.locations?.map(l => l.id),
      productUploadId: this.productUploadId,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
