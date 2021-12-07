import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionRO } from '../ro/subscription.ro';

@Entity('subscription')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false, unique: true, name: 'business_id' })
  businessId: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column('varchar', {
    nullable: true,
    default: null,
    name: 'phone_number_1',
  })
  phoneNumber1: string;

  @Column('varchar', {
    nullable: true,
    default: null,
    name: 'phone_number_2',
  })
  phoneNumber2: string;

  @Column('boolean', { default: true, nullable: true })
  confirmed: boolean;

  toResponseObject(): SubscriptionRO {
    return {
      id: this.id,
      businessId: this.businessId,
      createdAt: this.createAt,
      updatedAt: this.updatedAt,
      phoneNumber1: this.phoneNumber1,
      phoneNumber2: this.phoneNumber2,
      confirmed: this.confirmed,
    };
  }
}
