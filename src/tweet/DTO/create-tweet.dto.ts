import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTweetDTO{
    @IsString()
    @IsNotEmpty()
    text:string;

    @IsString()
    @IsOptional()
    image?:string;

    @IsNumber()
    @IsNotEmpty()
    userId:number;

    @IsArray()
    @IsInt({each:true})
    @IsOptional()
    hashtags?:number[];
}