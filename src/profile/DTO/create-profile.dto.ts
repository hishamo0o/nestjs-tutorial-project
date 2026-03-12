import {
  IsBoolean,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProfileDTO {
  @IsString({ message: 'name should be a string' })
  @MinLength(3, { message: 'name should be at least 3 chars' })
  @MaxLength(10, { message: 'name can be maximum 10 chars' })
  @IsOptional()
  firstName?: string;

  @IsString({ message: 'last name should be a string' })
  @MinLength(3, { message: 'last name should be at least 3 chars' })
  @MaxLength(10, { message: 'last name can be maximum 10 chars' })
  @IsOptional()
  lastName?: string;

  @IsString({ message: 'gender should be a string' })
  @MaxLength(7, { message: 'gender can be maximum 7 chars' })
  @IsIn(['male', 'female'], { message: 'gender should be male or female' })
  @IsOptional()
  gender?: string;

  @IsBoolean({ message: 'isMarried should be boolean' })
  @IsOptional()
  @IsOptional()
  isMarried?: boolean;

  @IsDate({message:"dateOfBirth should be of type Date"})
  @IsOptional()
  dateOfBirth?: Date;

  @IsString({message:"bio should be text or string"})
  @IsOptional()
  bio?:string;

  @IsString({message:"image link should be text or string"})
  @IsOptional()
  profileImage?:string;
}
