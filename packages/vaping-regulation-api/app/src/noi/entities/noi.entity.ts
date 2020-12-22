import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NoiRO } from 'src/noi/ro/noi.ro';
import { LocationEntity } from 'src/location/entities/location.entity';
import { BusinessEntity } from 'src/business/entities/business.entity';

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

  toResponseObject(): NoiRO {
    return {
      id: this.id,
      locationId: this.location?.id,
      businessId: this.business?.id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
