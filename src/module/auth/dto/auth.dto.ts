import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Length } from "class-validator";
import { AuthType } from "../enums/type.enum";
import { AuthMethod } from "../enums/method.enum";

export class AuthDto{
    @ApiProperty()
    @IsString()
    @Length(3,30, {message:"خطا!!!"})
    username:string;

    @ApiProperty({enum:AuthType})
    @IsEnum(AuthType)
    type:string;

    @ApiProperty({enum:AuthMethod})
    @IsEnum(AuthMethod)
    method:AuthMethod;
}

export class checkOtpDto{
    @ApiProperty()
    @IsString()
    @Length(5,5,{message:"error!"})
    code:string;
}

export class UserBlockDto{
    @ApiProperty()
    userId:number;
}