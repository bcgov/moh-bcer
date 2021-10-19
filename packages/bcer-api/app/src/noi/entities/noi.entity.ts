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
import moment from 'moment';
import { CronConfig } from 'src/cron/config/cron.config';

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

  @Column({type: 'timestamp', nullable: true, default: null})
  renewed_at: Date;

  toResponseObject(): NoiRO {
    const assignStatus = (created: Date, renewed: Date): NoiStatus => {
      const renewDate = renewed ? renewed : created;
      return moment(renewDate).isAfter(CronConfig.getNoiExpiryDate()) ? NoiStatus.SUBMITTED : NoiStatus.NOT_RENEWED;
    };

    return {
      id: this.id,
      locationId: this.location?.id,
      businessId: this.business?.id,
      created_at: this.created_at,
      updated_at: this.updated_at,
      status: assignStatus(this.created_at, this.renewed_at),
    };
  }
}
