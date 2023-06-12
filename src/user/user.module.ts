import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
//import { ConfigModule } from '@nestjs/config';

@Module({
  //imports: [ConfigModule.forRoot()], // !这种方式，要求每个使用到的module都要引入，麻烦，所以采用全局的
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
