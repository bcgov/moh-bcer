import { BusinessEntity } from "src/business/entities/business.entity";
import { LocationEntity } from "src/location/entities/location.entity"
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('note')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  content: string;

  @ManyToOne(
    () => BusinessEntity,
    (business: BusinessEntity) => business.notes
  )
  business: BusinessEntity;

  @ManyToOne(
    () => LocationEntity,
    (location: LocationEntity) => location.notes
  )
  location: LocationEntity;

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.notes
  )
  user: UserEntity;
}