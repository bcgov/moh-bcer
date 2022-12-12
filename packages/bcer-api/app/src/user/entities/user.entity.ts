import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Generated
} from 'typeorm';

import { UserTypeEnum } from '../enums/user-type.enum'
import { UserRO } from '../ro/user.ro';

import { BusinessEntity } from 'src/business/entities/business.entity';
import { NoteEntity } from 'src/note/entities/note.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
  @Generated()
  id: string;

  @Column('int', {
    default: 1
  })
  user_status_id: number;

  @Column('enum', {
    enum: UserTypeEnum,
    nullable: false,
    default: UserTypeEnum.BUSINESS_OWNER,
  })
  type: UserTypeEnum;

  @Column('varchar', {
    length: 255,
    name: 'first_name',
    nullable: true,
  })
  firstName: string;

  @Column('varchar', {
    length: 255,
    name: 'last_name',
    nullable: true,
  })
  lastName: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  bceid: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  bceidUser: string;

  @Column('time', {
    nullable: true,
  })
  lastLogin: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.users)
  business: BusinessEntity;

  // Allows us to get the business id without getting the whole relation
  @Column({ nullable: true })
  businessId: string;
  
  @OneToMany(
    () => NoteEntity,
    (note: NoteEntity) => note.user
  )
  notes: NoteEntity[];

  toResponseObject(): UserRO {
    return {
      id: this.id,
      bceid: this.bceid,
      bceidUser: this.bceidUser,
      user_status_id: this.user_status_id,
      type: this.type,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      created_at: this.created_at,
      updated_at: this.updated_at,
      businessId: this.businessId,
      business: this.business?.toResponseObject(),
    };
  }
}
