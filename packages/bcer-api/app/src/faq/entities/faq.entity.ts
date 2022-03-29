import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FaqRO } from '../ro/faq.ro';

@Entity('faq')
export class FaqEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'jsonb',
  })
  content: JSON;

  toResponseObject(): FaqRO{
    return {
      id: this.id,
      content: this.content,
    }
  }
}
