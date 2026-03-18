import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import authConfig from './config/auth.config';
import { CreateUserDTO } from 'src/user/DTO/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  isAuthenticated: boolean = false;
  constructor(
    @Inject(forwardRef(() => UserService))
    // @Inject()
    private readonly userService: UserService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByUserName(loginDto.userName);

    const passwordsAreEqual = await this.hashingProvider.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!passwordsAreEqual)
      throw new UnauthorizedException(`password is wrong`);

    const token = await this.jwtService.signAsync(
      { sub: user.id, userName: user.userName },
      {
        secret: this.authConfiguration.secret,
        expiresIn: this.authConfiguration.expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );

    return {
      token:token
    };
  }

  async signUp(createUserDto: CreateUserDTO) {
    return await this.userService.createUser(createUserDto);
  }
}
