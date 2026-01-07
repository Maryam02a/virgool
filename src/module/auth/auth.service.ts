import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "../user/entities/profile.entity";
import { OtpEntity } from "../user/entities/otp.entity";
import { BadRequestException, ConflictException, Inject, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { TokenService } from "./token.service";
import { AuthDto } from "./dto/auth.dto";
import type { Request, Response } from 'express';
import { AuthResponse } from "./types/response";
import { AuthType } from "./enums/type.enum";
import { AuthMethod } from "./enums/method.enum";
import { isEmail, isMobilePhone } from "class-validator";
import { randomInt } from "crypto";
import { CookieKeys } from "src/common/enums/cookie.enum";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";
import { PublicMessage } from "src/common/enums/message";
@Injectable({ scope:Scope.REQUEST})
export class AuthService{
    constructor(
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private profileRepository:Repository<ProfileEntity>,
        @InjectRepository(OtpEntity) private otpRepository:Repository<OtpEntity>,
        @Inject(REQUEST) private request:Request,
        private tokenService:TokenService
    ){}


    async checkExistUser(method:AuthMethod , username:string){
        let user:UserEntity | null;
        if(method === AuthMethod.Phone){
            user = await this.userRepository.findOneBy({phone :username});
        }else if(method === AuthMethod.Email){
            user = await this.userRepository.findOneBy({email:username});
        }else if( method === AuthMethod.Username){
            user = await this.userRepository.findOneBy({username})
        }else {
            throw new BadRequestException("user not exist")
        }
        return user;
    }


    async login(method:AuthMethod, username:string){
        const validUsername =this.usernameValidator(method , username);
        let user :UserEntity | null = await this.checkExistUser(method,validUsername);
        if(!user) throw new UnauthorizedException("account is not find")

        const otp = await this.saveOtp(user.id , method);
        const token = this.tokenService.createOptToken({userId :user.id})
        return {
            token,
            code:otp.code,
            method
        }
    }

    async sendOtp(method:AuthMethod, username:string, code:string){
        if(method == AuthMethod.Email){
            console.log("send Email success");
        }else if(method == AuthMethod.Phone){
           // await 
        }
    }

    async sendResponse(res:Response , result:AuthResponse){
        const { code, token } = result;
        res.cookie(CookieKeys.OTP, token , CookiesOptionsToken());
        res.json({
            message:PublicMessage.SendOtp,
            code,
        })
    }

    async register(method:AuthMethod, username:string){
        const validUsername = this.usernameValidator(method , username);
        let user :UserEntity | null = await this.checkExistUser(method , validUsername);
        if(user) throw new ConflictException("the user Already Exist");
        if(method === AuthMethod.Username){
            throw new BadRequestException("the user exist")
        }
        user = this.userRepository.create({
            [method] :username,
        });
        user = await this.userRepository.save(user);

        user.username = `m_${user.id}`;
        await this.userRepository.save(user);
        const otp = await this.saveOtp(user.id , method);

        const token = this.tokenService.createOptToken({userId:user.id});
        return{
            token,
            code:otp.code
        }
    }

    async userExistence(authDto :AuthDto , res:Response) {
        const {method, type, username} = authDto;
        let result :AuthResponse;
        switch(type){
            case AuthType.Login:
                result= await this.login(method, username);
                return this.sendResponse(res, result);
            case AuthType.Register:
                result = await this.register(method , username);
                return this.sendResponse(res, result);
            default: throw new UnauthorizedException('');
        }
    }


    async validateAccessToken(token :string){
        const { userId } = this.tokenService.verifyAccessToken(token);
        const user = await this.userRepository.findOneBy({ id : userId });
        if(!user) throw new UnauthorizedException("login again later");
        return user;
    }

    async saveOtp(userId:number , method:AuthMethod){
        const code = randomInt(10000,99999).toString();
        const expiresIn = new Date(Date.now() + (1000 * 60 * 2 ));
        let otp = await this.otpRepository.findOneBy({ userId });
        let existOtp = false;
        if(otp){
            existOtp =true;
            otp.code = code;
            otp.expiresIn = expiresIn;
            otp.method = method;
        }else{
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId,
                method
            })
        }
        otp = await this.otpRepository.save(otp);
        if(!existOtp){
            await this.userRepository.update({id:userId},{
                otpId:otp.id
            })
        }
        return otp;
    }


    async checkOtp(code:string){
        const token = this.request.cookies?.[CookieKeys.OTP];
        if(!token) throw new UnauthorizedException("expired code");
        const { userId } = this.tokenService.verifyOtpToken(token);
        const otp = await this.otpRepository.findOneBy({ userId })
        if(!otp) throw new UnauthorizedException("please login again")
        const now = new Date();
        if(otp.expiresIn<now) throw new UnauthorizedException("the code expires in");
        if(otp.code != code) throw new UnauthorizedException("try again");

        const accessToken = this.tokenService.craetAccessToken({ userId });
        if(otp.method === AuthMethod.Email) {
            await this.userRepository.update({ id: userId },{
                verify_email:true
            })
        }else if(otp.method == AuthMethod.Phone){
            await this.userRepository.update({id:userId}, {
                verify_phone:true
            })
        }
        return{
            message:PublicMessage.LogedIn,
            accessToken
        }
    }


    usernameValidator(method:AuthMethod , username:string){
        switch (method) {
            case AuthMethod.Email:
                if(isEmail(username)) return username;
                throw new BadRequestException("format of email is uncorrect");
            case AuthMethod.Phone:
                if(isMobilePhone(username, "fa-IR")) return username;
                throw new BadRequestException("the phone num is uncorrect");
            case AuthMethod.Username:
                return username;
            default:
                throw new UnauthorizedException("the information is invalid")
        }
    }
}