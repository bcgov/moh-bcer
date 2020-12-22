import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
} from 'typeorm';

@Entity('user_type')
export class UserTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 64
  })
  name: string;
}
