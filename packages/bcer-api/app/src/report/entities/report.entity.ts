import { UserEntity } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, UpdateDateColumn } from "typeorm";
import { Generated } from "typeorm/decorator/Generated";
import { Column } from "typeorm/decorator/columns/Column";
import { PrimaryColumn } from "typeorm/decorator/columns/PrimaryColumn";
import { ManyToOne } from "typeorm/decorator/relations/ManyToOne";
import { ReportRequestDto } from "../dto/report.dto";

@Entity('report')
export class ReportEntity {
    @PrimaryColumn({default:() =>'gen_random_uuid()', type:'uuid'})
    @Generated()
    id: string;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.reports, {nullable: false, eager: true })
    @JoinColumn({name : "generated_by"})
    user: UserEntity;

    @Column('json')
    query: ReportRequestDto;

    @Column('json', {
        nullable: true,
    })
    result: any;

    @CreateDateColumn({
      name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
      name: 'updated_at',
    })
    updatedAt: Date;
}