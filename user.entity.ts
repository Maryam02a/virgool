import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { UserStatus } from "../enum/status.enums";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";


@Entity(EntityNames.User)
export class UserEntity extends BaseEntity{
    @Column({ unique:true , nullable:true })
    username:string;

    @Column({ unique:true, nullable:true })
    phone:string;

    @Column({ unique:true, nullable:true })
    email:string;

    @Column({ type:'numeric', nullable:true,default:0 })
    balance:number;

    @Column({ default:Roles.User })
    role:string;

    @Column({
        type:'enum',
        enum:UserStatus,
        nullable:true
    })
    status:string | null;

    @Column({ nullable:true })
    new_phone:string;

    @Column({ nullable:true })
    new_email:string;

    @Column({ nullable:true })
    verify_phone:string;

    @Column({ nullable:true })
    verify_email:string;

    @Column({ nullable:true })
    password:string;

    @Column({nullable:true})
    otpId:number;

    @OneToOne(() => OtpEntity, otp => otp.user, {nullable:true})
    @JoinColumn()
    otp:OtpEntity;

    @OneToOne(() =>ProfileEntity , otp => otp.user, {nullable:true})
    @JoinColumn()
    profile:ProfileEntity;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;
}