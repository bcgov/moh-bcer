import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { ManufacturingRO } from 'src/manufacturing/ro/manufacturing.ro';
import { BusinessEntity } from 'src/business/entities/business.entity';
import { LocationEntity } from 'src/location/entities/location.entity';
import { IngredientEntity } from 'src/manufacturing/entities/ingredient.entity';

@Entity('manufacturing')
export class ManufacturingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  productName: string;

  @ManyToMany(() => IngredientEntity, (ingredient: IngredientEntity) => ingredient.manufactured, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinTable()
  ingredients: IngredientEntity[];

  @ManyToMany(() => LocationEntity, (location: LocationEntity) => location.manufactures)
  locations: LocationEntity[];

  @ManyToOne(() => BusinessEntity, (business: BusinessEntity) => business.products)
  @JoinColumn()
  business: BusinessEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toResponseObject(): ManufacturingRO {
    return {
      id: this.id,
      productName: this.productName,
      ingredients: this.ingredients?.map(i => i.toResponseObject()),
      locations: this.locations?.map(l => l.toResponseObject()),
      business: this.business?.id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
