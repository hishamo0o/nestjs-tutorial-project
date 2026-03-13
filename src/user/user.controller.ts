import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/user/DTO/create-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    @Get()
    getAllUsers(@Query() paginatQueryDto:PaginationQueryDto){
        return this.userService.getAllUsers(paginatQueryDto);
    }
    @Get(':id')
    async getUserById(@Param('id' , ParseIntPipe) id:number){
        return await this.userService.getUserById(id);
    } 
    // @Post()
    // async createUser(@Body() body:CreateUserDTO){
    //     return await this.userService.createUser(body);
    // }
    @Delete(':id')
    async deleteUserUsingId(@Param('id' , ParseIntPipe) id:number){
        await this.userService.deleteUserWithItsProfile(id);
    }
}
 