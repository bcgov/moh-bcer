import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
} from 'typeorm';

@Entity('user_status')
export class UserStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 64
  })
  name: string;
}
