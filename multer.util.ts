import { BadRequestException } from "@nestjs/common";
import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";
import { ValidationMessage } from "../enums/message.enum";
import { diskStorage } from "multer";
export type CallbackDestination = (error:Error | null, destination:string) => void;
export type CallbackFileName = (error:Error | null , fileName:string) =>void;
export type MulterFile = Express.Multer.File

export function MulterDestination(fieldName:string){
    return function (req:Request , file:MulterFile, callback :CallbackDestination) :void{
        let path = join("public","uploads" ,fieldName);
        mkdirSync(path, {recursive :true});
        callback(null, path);
    }
}

export function MulterFileName(req:Request,file:MulterFile, callback:CallbackDestination):void {
    const ext = extname(file.originalname).toLowerCase();
    if(!isValidImageFormat(ext)){
        throw new BadRequestException(ValidationMessage.InvalidImageFormat);
    }else{
        const fileName = `${Date.now()}${ext}`;
        callback(null, fileName);
    }
}

function isValidImageFormat(ext:string){
    return [".png", "jpg", "jpeg"].includes(ext);
}

export function multerStorage(folderName:string){
    return diskStorage({
        destination:MulterDestination(folderName),
        filename:MulterFileName,
    })
}