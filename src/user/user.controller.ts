import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
@Controller('user')
export class UserController {
  constructor(
    private readonly appService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): any {
    console.log('user');
    console.log(this.configService.get(ConfigEnum.DB)); // !获取环境变量.env的值，nestjs使用dotenv
    console.log(this.configService.get(ConfigEnum.DB_HOST));
    return this.appService.getUser();
  }

  @Post('add')
  addHello(): any {
    console.log(111);
    return this.appService.addUser();
  }
}
