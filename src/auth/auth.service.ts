import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(readonly userService: UserService, private jwt: JwtService) {}
  
  async signin(username: string, password: string) {
    const user = await this.userService.find(username)
    if (user && user.password === password) {
      // !生成token
      return await this.jwt.signAsync({ // !PAYLOAD
        username: user.username,
        sub: user.id, // !随便换
        // userId: user.id,
        // age: 20
      }, 
      //{ expiresIn: '1d' } // !局部设置
      )
    }
    throw new UnauthorizedException()
  }

  signup(username: string, password: string) {
    return this.userService.create({ username, password })
  }
}
