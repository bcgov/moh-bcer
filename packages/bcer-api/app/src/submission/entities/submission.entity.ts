import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Generated
} from 'typeorm';

import { SubmissionRO } from 'src/submission/ro/submission.ro';
import { SubmissionTypeEnum } from 'src/submission/enums/submission.enum';

import { BusinessEntity } from 'src/business/entities/business.entity';

@Entity('submission')
export class SubmissionEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
  @Generated()
  id: string;

  @Column('varchar')
  businessId?: string;

  @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.submissions)
  business: BusinessEntity;

  @Column({
    type: 'enum',
    enum: SubmissionTypeEnum,
  })
  type: SubmissionTypeEnum;

  @Column('json')
  data: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toResponseObject(): SubmissionRO {
    function formatData (data) {
      // this is fairly manual but will work for now to prevent th BE from sending the front
      // a huge pile of locations if we get a big CSV
      if (data.locations) {
        const limitedLocations = data.locations.slice(0, 500)
        data.locations = limitedLocations;
      }
      return data
    }
    return {
      id: this.id,
      business: this.business?.legalName,
      businessId: this.businessId,
      data: formatData(this.data),
      type: this.type
    };
  }
}
