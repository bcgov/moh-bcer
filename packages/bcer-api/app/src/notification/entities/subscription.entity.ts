import { BusinessEntity } from 'src/business/entities/business.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionRO } from '../ro/subscription.ro';

@Entity('subscription')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => BusinessEntity,
    (business: BusinessEntity) => business.subscription,
    { nullable: false },
  )
  @JoinColumn()
  business: BusinessEntity;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      phoneNumber1: this.phoneNumber1,
      phoneNumber2: this.phoneNumber2,
      confirmed: this.confirmed,
    };
  }
}
