import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      // !校验逻辑
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ! Authorization: Bearer xxtoken
      jwtFromRequest: ExtractJwt.fromHeader('user-token'), // ! user-token: token
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    })
  }

  /*
    @Get('profile') // !访问这个接口时，会执行jwt.strategy.ts的validate校验
    @UseGuards(AuthGuard('jwt'))
  */
  async validate(payload: any) {
    console.log('payload', payload) //!会把payload数据加到接口的req上
    return { username: payload.username, sub: payload.sub }
  }
}