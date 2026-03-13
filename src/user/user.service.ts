import {
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/user/DTO/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { ConfigService } from '@nestjs/config';
import { UserAlreadyExistsException } from 'src/CustomException/user-already-exists.exception';
import { Paginated } from 'src/common/pagination/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    // @Inject(forwardRef(() => AuthService))
    // private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private readonly paginateProvider:PaginationProvider
  ) {}

  async getAllUsers(paginateQueryDto:PaginationQueryDto):Promise<Paginated<User>> {
    try {
      // const evn = this.configService.get<string>('ENV_MODE');
      // console.log(evn);
      // return await this.userRepository.find({
      //   relations: {
      //     profile: true, //for eager loading for profile only instead of doing it in the relationship in user entity
      //   },
      // });
      return await this.paginateProvider.paginateQuery(paginateQueryDto , this.userRepository , undefined , ['profile'])
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          `an error has accured error : ${error} , pls try again later`,
          { description: `couldn't connect to the DB` },
        );
      }
      // console.log(error);
      throw error ;
    }
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      // throw new NotFoundException(`couldn't find user with id ${id}`);
      throw new HttpException(
        `couldn't find user with id ${id}`,
        HttpStatus.NOT_FOUND,
        {
          description: `excpetions happened cos we are trying to get a user with id : ${id} which is not found `,//only for developers 
          // cause:
        },
      );
    }

    return user;
  }

  public async createUser(userDTO: CreateUserDTO) {
    try {
      const userExist = await this.userRepository.findOne({
        where: [{ userName: userDTO.userName }, { email: userDTO.email }],
      });

      if (userExist) {
        let message:'userName'|'email';
        if (userExist.userName === userDTO.userName) message = 'userName';
        else message = 'email';
        throw new UserAlreadyExistsException(message , userDTO[message])
      }

      // //Create a Profile
      userDTO.profile = userDTO.profile ?? {}; // without this line
      //  , only the user will be created even u specified cascade on the insert ,
      //  but anyway if a profile is not provided or null ,
      //  it won't create it , but when providing an empty profile it will create it automatically when the user is created and save it.
      const user = this.userRepository.create(userDTO);

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      if (error?.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          `an error has accured error : ${error} , pls try again later`,
          { description: `couldn't connect to the DB` },
        );
      } else throw error;
    }
  }

  public async deleteUserWithItsProfile(id: number) {
    // const user = await this.userRepository.findOneBy({ id });
    await this.userRepository.delete({ id });
    // if (user?.profile) {
    // await this.profileRepository.delete(user.profile.id);
    // }
    return { deleted: true };
  }
}
