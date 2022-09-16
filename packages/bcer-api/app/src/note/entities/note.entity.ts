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
import { NoteRO } from '../ro/note.ro';

@Entity('note')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  content: string;

  @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.notes)
  business: BusinessEntity;

  @ManyToOne(() => LocationEntity, (location: LocationEntity) => location.notes)
  location: LocationEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.notes)
  user: UserEntity;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;

  toResponseObject(): NoteRO{
    return {
      id: this.id,
      content: this.content,
      user: this.user?.toResponseObject(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
