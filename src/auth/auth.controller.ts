import { Body, Controller, HttpException, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { SigninUserDto } from './dto/signin-user.dto';

export function TypeOrmDecorator() {
  return UseFilters(TypeormFilter)
}

@Controller('auth')
//@UseFilters(TypeormFilter) // !局部filter，这种方式构造函数的参数只需要inject，   // !可以针对Controller和路由控制
@TypeOrmDecorator() // !封装装饰器 
export class AuthController {
  constructor(private authService: AuthService, readonly userService: UserService) {

  }

  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    const { username, password } =dto
    return this.authService.signin(username, password)
    //return this.userService.findAll(dto)
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password } =dto
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 500)
    // }
    return this.authService.signup(username, password)
  }
}
