import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NotificationRO } from "../ro/notification.ro";

@Entity('notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        length: 255,
        nullable: true
    })
    sender: string;

    @Column('varchar', {
        length: 64,
        nullable: true,
    })
    title: string;

    @Column('varchar', {
        length: 650,
        nullable: false,
    })
    message: string;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;

    @Column('boolean', {
        nullable: false,
        default: false
    })
    completed: boolean;

    @Column('int', {
        nullable: true,
    })
    success: number;

    @Column('int', {
        nullable: true,
    })
    fail: number; 

    @Column('json', {
        name: 'error_data',
        default: null,
        nullable: true,
    })
    errorData: any;

    toResponseObject(): NotificationRO {
        return{
            id: this.id,
            sender: this.sender,
            title: this.title,
            message: this.message,
            success: this.success,
            fail: this.fail,
            errorData: this.errorData,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            completed: this.completed,
        }
    }
}