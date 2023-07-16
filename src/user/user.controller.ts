import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
@Controller('user')
export class UserController {
  //private readonly userService: UserService;
  constructor(
    private readonly userService: UserService, // !相当于上面和下面注释的两行，private readonly userService: UserService;   this.userService = new UserService()
    private configService: ConfigService,
  ) {
    //this.userService = new UserService()
  }

  @Get()
  getHello(): any {
    console.log('user');
    console.log(this.configService.get(ConfigEnum.DB)); // !获取环境变量.env的值，nestjs使用dotenv
    console.log(this.configService.get(ConfigEnum.DB_HOST));
    console.log(this.configService.get(ConfigEnum.DB_URL));
    console.log(this.configService.get('db1'));
    const obj = {
      DB: this.configService.get(ConfigEnum.DB),
      DB_HOST: this.configService.get(ConfigEnum.DB_HOST),
      DB_URL: this.configService.get(ConfigEnum.DB_URL),
      db1: this.configService.get('db1') || '',
    }
    return this.userService.getUser(obj);
  }

  @Post('add')
  addHello(): any {
    console.log(111);
    return this.userService.addUser();
  }
}
