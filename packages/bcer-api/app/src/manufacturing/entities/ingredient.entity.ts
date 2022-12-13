import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  Generated
} from 'typeorm';

import { ManufacturingEntity } from 'src/manufacturing/entities/manufacturing.entity';
import { IngredientRO } from 'src/manufacturing/ro/ingredient.ro';

@Entity('ingredient')
export class IngredientEntity {
  @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
  @Generated()
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  scientificName: string;

  @Column('varchar')
  manufacturerName: string;

  @Column('varchar')
  manufacturerAddress: string;

  @Column('varchar')
  manufacturerPhone: string;

  @Column('varchar')
  manufacturerEmail: string;

  @ManyToMany(() => ManufacturingEntity, (manufactured: ManufacturingEntity) => manufactured.ingredients)
  manufactured: ManufacturingEntity[];

  toResponseObject(): IngredientRO {
    return {
      id: this.id,
      manufacturerName: this.manufacturerName,
      manufacturerAddress: this.manufacturerAddress,
      manufacturerPhone: this.manufacturerPhone,
      manufacturerEmail: this.manufacturerEmail,
      name: this.name,
      scientificName: this.scientificName,
      manufactured: this.manufactured?.map(m => m.id),
    };
  }

}
