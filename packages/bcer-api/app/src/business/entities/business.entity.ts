import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { BusinessRO } from 'src/business/ro/business.ro';

import { SubmissionEntity } from 'src/submission/entities/submission.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { NoiEntity } from 'src/noi/entities/noi.entity';
import { ManufacturingEntity } from 'src/manufacturing/entities/manufacturing.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductSoldEntity } from 'src/product-sold/entities/product-sold.entity';
import { SubscriptionEntity } from 'src/notification/entities/subscription.entity';
import { NoteEntity } from 'src/note/entities/note.entity';

@Entity('business')
export class BusinessEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: true, default: '' })
  legalName: string;

  @Column('varchar', { nullable: true, default: '' } )
  businessName: string;

  @Column('varchar', { nullable: true, default: '' } )
  email: string;

  @Column('varchar', { nullable: true, default: '' })
  webpage: string;

  @Column('varchar', { nullable: true, default: '' } )
  addressLine1: string;

  @Column('varchar', { nullable: true, default: '' })
  addressLine2: string;

  @Column('varchar', { nullable: true, default: '' } )
  city: string;

  @Column('varchar', { nullable: true, default: '' } )
  postal: string;

  @Column('varchar', { nullable: true, default: '' } )
  phone: string;

  @OneToMany(() => UserEntity, (user) => user.business)
  users: []

  @OneToMany(() => LocationEntity, (location) => location.business)
  locations: []

  @OneToMany(() => NoiEntity, (noi) => noi.business)
  nois: []

  @OneToMany(() => ProductEntity, (product) => product.business)
  products: []

  @OneToMany(() => ProductSoldEntity, (productSold) => productSold.business)
  productSolds: []

  @OneToMany(() => ManufacturingEntity, (manufacturingReport) => manufacturingReport.business)
  manufactures: []

  @OneToMany(() => SubmissionEntity, (submission) => submission.business)
  submissions: []

  @OneToOne(() => SubscriptionEntity, (subscription: SubscriptionEntity) => subscription.business, { nullable: true })
  subscription: SubscriptionEntity;

  @Column('json', { nullable: true })
  notificationPreferences: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => NoteEntity,
    (note: NoteEntity) => note.business
  )
  notes: NoteEntity[];

  toResponseObject(): BusinessRO {
    return {
      id: this.id,
      legalName: this.legalName,
      businessName: this.businessName,
      email: this.email,
      webpage: this.webpage,
      addressLine1: this.addressLine1,
      addressLine2: this.addressLine2,
      city: this.city,
      postal: this.postal,
      phone: this.phone,
      locations: this.locations?.map((l: LocationEntity) => l.toResponseObject()) || [],
      nois: this.nois?.map((n: NoiEntity) => n.toResponseObject()) || [],
      products: this.products?.map((p: ProductEntity) => p.toResponseObject()) || [],
      manufactures: this.manufactures?.map((m: ManufacturingEntity) => m.toResponseObject()) || [],
      users: this.users?.map((u: UserEntity) => u.id) || [],
      submissions: this.submissions?.map((s: SubmissionEntity) => s.id) || [],
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
