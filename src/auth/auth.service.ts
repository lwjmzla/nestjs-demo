import { Injectable } from '@nestjs/common';
import { getUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(readonly userService: UserService) {}
  
  signin(username: string, password: string) {
    const params = { username } as getUserDto
    return this.userService.findAll(params)
  }

  signup(username: string, password: string) {
    return this.userService.create({ username, password })
  }
}
