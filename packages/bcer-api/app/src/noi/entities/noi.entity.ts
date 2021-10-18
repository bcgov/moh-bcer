import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { NoiRO } from 'src/noi/ro/noi.ro';
import { LocationEntity } from 'src/location/entities/location.entity';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { NoiStatus } from '../enums/status.enum';

@Entity('noi')
export class NoiEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => LocationEntity, (location: LocationEntity) => location.noi)
  location: LocationEntity;

  @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.nois)
  @JoinColumn()
  business: BusinessEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('enum', {
    enum: NoiStatus,
    nullable: false,
    default: NoiStatus.SUBMITTED
  })
  status: string;

  toResponseObject(): NoiRO {
    return {
      id: this.id,
      locationId: this.location?.id,
      businessId: this.business?.id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      status: this.status,
    };
  }
}
