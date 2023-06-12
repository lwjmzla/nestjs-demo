import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getHello(): any {
    console.log('user');
    return this.appService.getUser();
  }

  @Post('add')
  addHello(): any {
    console.log(111);
    return this.appService.addUser();
  }
}
