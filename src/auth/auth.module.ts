import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

//@Global()
@Module({
  // !引入了Module，理论上就可以使用Service（还需要exports: [UserService]）
  imports: [UserModule, PassportModule, JwtModule.registerAsync({
    global: true, // ! 非常重要   和@Global()+exports: [JwtModule] 一样 都是实现全局模块
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
      signOptions: {
        expiresIn: '1d'
      }
    }),
    inject: [ConfigService],
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  //exports: [JwtModule]
})
export class AuthModule {}
