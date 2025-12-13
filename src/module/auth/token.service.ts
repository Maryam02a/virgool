import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { AccessTokenPayload, CookiePayload, EmailTokenPayload, PhoneTokenPayload } from "./types/payload";
@Injectable()
export class TokenService {
    constructor(
        private jwtService :JwtService
    ){}

    createOptToken(payload :CookiePayload){
        const token =this.jwtService.sign(payload , {
            secret :process.env.OTP_TOKEN_SECRET,
            expiresIn: 60 * 2
        });
        return token
    }

    verifyOtpToken(token :string){
        try {
            return this.jwtService.verify(token, {
                secret:process.env.ACCESS_TOKEN_SECRET,
            })
        } catch (error) {
            throw new UnauthorizedException("try again later")
        }
    }

    craetAccessToken(payload:AccessTokenPayload) {
        const token = this.jwtService.sign(payload, {
            secret:process.env.ACCESS_TOKEN_SECRET,
            expiresIn:"1y"
        });
        return token
    }

    verifyAccessToken(token:string){
        try {
            return this.jwtService.verify(token, {
                secret:process.env.ACCESS_TOKEN_SECRET,
            })
        } catch (error) {
            throw new UnauthorizedException("Login again latter")
        }
    }
    createEmailToken(payload:EmailTokenPayload){
        const token = this.jwtService.sign(payload , {
            secret:process.env.EMAIL_TOKEN_SECRET,
            expiresIn:60*2
        })
        return token
    }

    verifyEmailToken(token:string){
        try {
            return this.jwtService.verify(token,{
                secret:process.env.EMAIL_TOKEN_SECRET
            })
        } catch (error) {
            throw new BadRequestException("error")
        }
    }

    createPhoneToken(payload:PhoneTokenPayload){
        const token = this.jwtService.sign(payload ,{
            secret:process.env.PHONE_TOKEN_SECRET,
            expiresIn:60*2
        })
        return token
    }

    verifyPhoneToken(token:string){
        try {
            return this.jwtService.verify(token,{
                secret:process.env.PHONE_TOKEN_SECRET
            })
        } catch (error) {
            throw new UnauthorizedException("error")
        }
    }
}