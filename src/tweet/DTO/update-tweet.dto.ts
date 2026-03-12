import { PartialType } from "@nestjs/mapped-types";
import { CreateTweetDTO } from "./create-tweet.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateTweetDto extends PartialType(CreateTweetDTO){
    @IsInt()
    @IsNotEmpty()
    id:number;
}