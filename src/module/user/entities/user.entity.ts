import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { UserStatus } from "../enum/status.enums";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Roles } from "src/common/enums/role.enums";
import { FollowEntity } from "./follow.entity";


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
    verify_phone:boolean;

    @Column({ nullable:true })
    verify_email:boolean;

    @Column({ nullable:true })
    password:string;

    @Column({nullable:true})
    otpId:number;

    @OneToOne(() => OtpEntity, otp => otp.user, {nullable:true})
    @JoinColumn()
    otp:OtpEntity;

    @Column({nullable:true})
    profileId:number;

    @OneToOne(() =>ProfileEntity , profile => profile.userId, {nullable:true})
    @JoinColumn()
    profile:ProfileEntity;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;

    @OneToMany(() => FollowEntity, follow => follow.following)
    followers :FollowEntity[];

    @OneToMany(() => FollowEntity, follow =>follow.follower)
    following:FollowEntity[];

}