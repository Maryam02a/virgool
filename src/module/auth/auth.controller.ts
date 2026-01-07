import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SwaggerConsumes } from "src/common/enums/swagger.consumes";
import { AuthDto, CheckOtpDto } from "./dto/auth.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import type{ Request, Response } from "express";

@Controller('auth')
@ApiTags("Auth")
export class AuthController{
    constructor(private readonly authService :AuthService){}

    @Post('user-existence')
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    userExistence(@Body() authDto : AuthDto, @Res() res:Response) {
        return this.authService.userExistence(authDto, res);
    }

    @Post('check-otp')
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    checkOtp(@Body() checkOtpDto :CheckOtpDto) {
        return this.authService.checkOtp(checkOtpDto.code)
    }

    @Get('check-login')
    @AuthDecorator()
    checkLogin(@Req() req:Request){
        return { user :req.user};
    }
}