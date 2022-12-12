import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';

import { HealthAuthority } from 'src/business/enums/health-authority.enum';
import { LocationRO } from 'src/location/ro/location.ro';

import { BusinessEntity } from 'src/business/entities/business.entity';
import { NoiEntity } from 'src/noi/entities/noi.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ManufacturingEntity } from 'src/manufacturing/entities/manufacturing.entity';
import { SalesReportEntity } from 'src/sales/entities/sales.entity';
import { ProductSoldEntity } from 'src/product-sold/entities/product-sold.entity';
import { LocationStatus } from '../enums/location-status.enum';
import { LocationReportingStatusRO } from '../ro/locationReportingStatus.ro';
import { NoteEntity } from 'src/note/entities/note.entity';
import { LocationType } from '../enums/location_type.enum';

@Entity('location')
export class LocationEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
  @Generated()
  id: string;

  @Column('varchar')
  email: string;

  @Column('varchar', { nullable: true })
  webpage: string;

  @Column('varchar', { nullable: true })
  addressLine1: string;

  @Column('varchar', { nullable: true })
  addressLine2: string;

  @Column('varchar', { nullable: true })
  city: string;

  @Column('varchar')
  postal: string;

  @Column('varchar')
  phone: string;

  @Column('varchar')
  underage: string;

  @Column('enum', {
    enum: HealthAuthority,
    nullable: true,
    default: HealthAuthority.ISLAND,
    name: 'health_authority',
  })
  ha: HealthAuthority;

  @Column('varchar', {
    nullable: true,
    name: 'health_authority_other',
  })
  ha_other: string;

  @Column('varchar', { nullable: true })
  doingBusinessAs: string;

  @Column('boolean', { nullable: true, default: false })
  manufacturing: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(
    () => BusinessEntity,
    (business: BusinessEntity) => business.locations,
  )
  @JoinColumn()
  business: BusinessEntity;

  @Column('varchar')
  businessId?: string;

  @OneToOne(
    () => NoiEntity,
    (noi: NoiEntity) => noi.location,
    { nullable: true },
  )
  @JoinColumn()
  noi: NoiEntity;

  @ManyToMany(
    () => ProductEntity,
    (product: ProductEntity) => product.locations,
  )
  @JoinTable()
  products: ProductEntity[];

  @OneToMany(
    () => ProductSoldEntity,
    (productSold: ProductSoldEntity) => productSold.location,
  )
  @JoinTable()
  productSolds: ProductSoldEntity[];

  @OneToMany(
    () => SalesReportEntity,
    (sales: SalesReportEntity) => sales.location,
  )
  sales: SalesReportEntity[];

  @ManyToMany(
    () => ManufacturingEntity,
    (manufacturing: ManufacturingEntity) => manufacturing.locations,
  )
  @JoinTable()
  manufactures: ManufacturingEntity[];

  @Column('enum', {
    enum: LocationStatus,
    nullable: false,
    default: LocationStatus.Active,
  })
  status: LocationStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
    name: 'closed_at',
  })
  closedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
    name: 'closed_time',
  })
  closedTime: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
    name: 'geo_address',
  })
  geoAddress: string;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
    name: 'geo_address_id',
  })
  geoAddressId: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  longitude: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  latitude: string;

  @Column({ type: 'varchar', nullable: true, default: null, name: 'geo_confidence' })
  geoAddressConfidence: string;

  @Column('enum', {
    enum: LocationType,
    nullable: false,
    default: LocationType.PHYSICAL,
    name: 'location_type',
  })
  location_type: LocationType;

  @OneToMany(
    () => NoteEntity,
    (note: NoteEntity) => note.location
  )
  notes: NoteEntity[];

  productsCount?: number;
  manufacturesCount?: number;
  salesCount?: number;

  reportStatus?: LocationReportingStatusRO;

  toResponseObject(): LocationRO {
    return {
      id: this.id,
      business: this.business?.toResponseObject(),
      noi: this.noi?.toResponseObject(),
      email: this.email,
      webpage: this.webpage,
      addressLine1: this.addressLine1,
      addressLine2: this.addressLine2,
      city: this.city,
      postal: this.postal,
      phone: this.phone,
      underage: ['yes', 'no'].includes(this.underage?.toLowerCase()) ? this.underage : 'other',
      underage_other: !['yes', 'no'].includes(this.underage?.toLowerCase())
        ? this.underage
        : '',
      health_authority: this.ha,
      health_authority_other: this.ha_other,
      doingBusinessAs: this.doingBusinessAs,
      manufacturing: this.manufacturing ? 'yes' : 'no',
      products: this.products?.map((product: ProductEntity) =>
        product.toResponseObject(),
      ),
      sales: this.sales?.map((sale: SalesReportEntity) =>
        sale.toResponseObject(),
      ),
      manufactures: this.manufactures?.map(
        (manufacturing: ManufacturingEntity) =>
          manufacturing.toResponseObject(),
      ),
      productsCount: this.productsCount,
      manufacturesCount: this.manufacturesCount,
      salesCount: this.salesCount,
      created_at: this.created_at,
      updated_at: this.updated_at,
      status: this.status,
      closedAt: this.closedAt,
      closedTime: this.closedTime,
      deletedAt: this.deletedAt,
      geoAddress: this.geoAddress,
      geoAddressId: this.geoAddressId,
      geoAddressConfidence: this.geoAddressConfidence,
      latitude: this.latitude,
      longitude: this.longitude,
      reportStatus: this.reportStatus,
      location_type: this.location_type,
    };
  }
}
