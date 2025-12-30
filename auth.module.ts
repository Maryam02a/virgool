import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { OtpEntity } from "../user/entities/otp.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity,OtpEntity, ProfileEntity])],
    controllers:[AuthController],
    providers:[AuthService,TokenService],
    exports:[AuthService,TokenService,TypeOrmModule]
})
export class AuthModule{}