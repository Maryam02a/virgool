import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "../enum/gender.enum";

export class ProfileDto{
    @ApiPropertyOptional()
    @IsOptional()
    @Length(5,30, {message:"نام کاربری وارد شده نامعتبر میباشد"})
    nick_name:string;

    @ApiPropertyOptional()
    @IsOptional()
    @Length(10,150,{message:"بیوگرافی نمیتواند بیشتر از تعداد مجاز کاراکتر داشته باشد"})
    bio:string;

    @ApiPropertyOptional({nullable:true, format:'binary'})
    image_profile:string;

    @ApiPropertyOptional({nullable:true, format:'binary'})
    bg_image:string;

    @ApiPropertyOptional({nullable:true})
    @IsOptional()
    @IsEnum(Gender)
    gender:string;

    @ApiPropertyOptional({nullable:true, example:"2000-01-15T07:27:48.4251"})
    birthday:Date;

    @ApiPropertyOptional({nullable:true})
    x_profile:string;

    @ApiPropertyOptional({nullable:true})
    linkdin_profile:string;
}

export class ChangePhoneDto{
    @ApiProperty()
    @IsMobilePhone("fa-IR", {} , {message:"شماره تماس نامعتبر میباشد"})
    phone:string;
}

export class ChangeEmailDto{
    @ApiProperty()
    @IsEmail({host_whitelist:["gmail.com", "yahoo.com"]}, {
        message:"ایمیل وارد شده نامعتبر میباشد"
    })
    email:string;
}

export class ChangeUsernameDto{
    @ApiProperty()
    @IsString()
    @Length(5,10,{message:"نام وارد شده تکراری میباشد"})
    username:string;
}