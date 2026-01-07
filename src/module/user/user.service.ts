import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "./entities/otp.entity";
import { ProfileEntity } from "./entities/profile.entity";
import { FollowEntity } from "./entities/follow.entity";
import{ REQUEST } from "@nestjs/core";
import type{ Request } from "express";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/token.service";
import { ProfileImages } from "./types/files";
import { ProfileDto } from "./dto/profile.dto";
import { RequestUser } from "./interface/Request.User";
import { isDate } from "class-validator";
import { Gender } from "./enum/gender.enum";
import { PublicMessage } from "src/common/enums/message";
import { EntityNames } from "src/common/enums/entity.enum";

@Injectable({ scope :Scope.REQUEST })
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository :Repository<OtpEntity>,
        @InjectRepository(ProfileEntity) private profileRepository :Repository<ProfileEntity>,
        @InjectRepository(FollowEntity) private followRepository : Repository<FollowEntity>,
        @Inject(REQUEST) private request :Request,
        private authService :AuthService,
        private tokenService:TokenService,
    ){}

    async changeProfile(files:ProfileImages, profileDto :ProfileDto) {
        if(files?.image_profile?.length > 0){
            let [image] = files?.image_profile;
            profileDto.image_profile = image?.path?.replace(/\\/g,'/');
        }
        if(files?.bg_image?.length>0){
            let [image] = files?.bg_image;
            profileDto.bg_image = image?.path?.replace(/\\/g,'/');
        }

        const {id:userId, profileId } = this.request.user as RequestUser;
        let profile = await this.profileRepository.findOneBy({ userId });
        const { bio, birthday,nick_name,bg_image,gender,image_profile,linkedin_profile,x_profile} = profileDto;
        if(profile) {
            if(bio) profile.bio = nick_name;
            if(nick_name) profile.bio = nick_name;
            if(birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
            if(gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
            if (linkedin_profile) profile.linkedin_profile =linkedin_profile
            if(x_profile) profile.x_profile = x_profile;
            if(image_profile) profile.image_profile = image_profile;
            if(bg_image) profile.bg_image = bg_image;
        }else{
            profile = this.profileRepository.create({
                nick_name,
                bio,
                birthday,
                gender,
                linkedin_profile,
                x_profile,
                bg_image,
                image_profile,
                userId,
            })
        }
        profile = await this.profileRepository.save(profile);
        if(!profileId){
            await this.userRepository.update({ id:userId}, {profileId:profile.id})
        }
        return{
            message:PublicMessage.Updated
        }
    }

    profile(){
        const { id } = this.request.user as RequestUser;
        return this.userRepository.createQueryBuilder(EntityNames.User)
            .where ({ id })
            .leftJoinAndSelect("user.profile", "profile")
            .loadRelationCountAndMap("user.followers", "user.followers")
            .loadRelationCountAndMap("user.following", "user.following")
            .getOne();
    }


}