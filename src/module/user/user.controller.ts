import { Body, Controller, Get, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { UserService } from "./user.service";
import { SwaggerConsumes } from "src/common/enums/swagger.consumes";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "src/common/utils/multer.util";
import { UploadedOptionalFiles } from "src/common/decorators/upload-file.decorator";
import type { ProfileImages } from "./types/files";
import { ProfileDto } from "./dto/profile.dto";

@Controller('user')
@ApiTags("User")
@AuthDecorator()
export class UserController{
    constructor(private readonly userService:UserService){}

    @Put("/profile")
    @ApiConsumes(SwaggerConsumes.MultipartData)
    @UseInterceptors(FileFieldsInterceptor([
        { name:"image_profile", maxCount:1},
        { name:"bg_image", maxCount:1 }
    ],{
        storage:multerStorage("user-profile")
    }))

    changeProfile(
        @UploadedOptionalFiles() files:ProfileImages,
        @Body() profileDto:ProfileDto
    ){
        return this.userService.changeProfile(files,profileDto)
    }

    @Get("/profile")
    profile(){
        return this.userService.profile();
    }
}