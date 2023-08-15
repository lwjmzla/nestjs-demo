import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    console.log('req', req.user)
    console.log(req.headers['user-token'])
    const user = await this.userService.find((req.user as any).username) // !继承AuthGuard('jwt')的req.user
    console.log(user)
    // !判断角色权限
    if (user.roles.filter(({ id }) => id === 2).length) {
      return true
    }
    return false;
  }
}
