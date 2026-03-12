import { HttpException , HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException{
    constructor(fieldName:string , fieldValue:string){
        super(`user with ${fieldName} '${fieldValue}' already exist` , HttpStatus.CONFLICT)
    }
}