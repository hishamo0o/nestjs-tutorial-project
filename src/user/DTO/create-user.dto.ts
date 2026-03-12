import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProfileDTO } from 'src/profile/DTO/create-profile.dto';

export class CreateUserDTO {
  @MinLength(4, { message: 'username must be 5 chars at least' })
  @MaxLength(24, { message: 'username can be at most 24 chars' })
  @IsString()
  @IsNotEmpty({ message: 'username Can not be empty' })
  userName: string;

  @MaxLength(35, { message: 'email can be maximum 35 chars' })
  @IsEmail()
  @IsNotEmpty({ message: 'email Can not be empty' })
  email: string;

  @MinLength(6, { message: 'password should be at least 6 chars' })
  @MaxLength(100, { message: 'password can be maximum 100 chars' })
  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  password: string;

  @IsOptional()
  @ValidateNested() // Tells Nest to validate the inner ProfileDTO
  @Type(() => CreateProfileDTO)
  profile?: CreateProfileDTO ;
}
