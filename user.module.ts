import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { OtpEntity } from "./entities/otp.entity";
import { FollowEntity } from "./entities/follow.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([UserEntity,OtpEntity,FollowEntity])
    ],
    controllers:[],
    providers:[UserService],
    exports:[UserService,TypeOrmModule]
})

export class UserModule{}