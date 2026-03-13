import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import authConfig from './config/auth.config';
import { CreateUserDTO } from 'src/user/DTO/create-user.dto';

@Injectable()
export class AuthService {
  isAuthenticated: boolean = false;
  constructor(
    // @Inject(forwardRef(() => UserService))
    @Inject()
    private readonly userService: UserService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  login(email: string, password: string) {
    console.log(this.authConfiguration.sharedSecret);
    // const user = this.userService.users.find((u) => u.email === email && u.password === password);
    // if (user) {
    // this.isAuthenticated = true;
    // return 'MY_TOKEN';
    // }
    return 'user not found';
  }

  async signUp(createUserDto: CreateUserDTO) {
    return await this.userService.createUser(createUserDto);
  }
}
