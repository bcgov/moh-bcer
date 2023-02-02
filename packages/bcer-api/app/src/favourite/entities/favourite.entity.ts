import { UserEntity } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { Generated } from "typeorm/decorator/Generated";
import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryColumn } from "typeorm/decorator/columns/PrimaryColumn";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";

@Entity('favourite')
export class FavouriteEntity {
    @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
    @Generated()
    id: string;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.favourites)
    user: UserEntity;

    @Column({
      type: 'varchar',
      length: 50,
    })
    title: string;

    @Column({
      type: 'varchar',
      name: 'search_params',
    })
    searchParams: string;

    @CreateDateColumn({
      name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
      name: 'updated_at',
    })
    updatedAt: Date;
}