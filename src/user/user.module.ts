import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm'
//import { ConfigModule } from '@nestjs/config';
import {User} from './entities/user.entity'
import {CounterMiddleware} from '../counter/counter.middleware'

@Module({
  //imports: [ConfigModule.forRoot()], // !这种方式，要求每个使用到的module都要引入，麻烦，所以采用全局的
  imports:[TypeOrmModule.forFeature([User])], // !将User实体同步到数据库
  controllers: [UserController],
  //providers: [UserService], // !把UserService里的功能注入到UserController
  providers: [
    {
      provide: 'user',
      useClass: UserService
    },
    {
      provide: 'userArr',
      useValue: ['lwj','lwb','lwz']
    },
    {
      provide: 'factory',
      useFactory() { // !运行程序时，就会执行useFactory这个方法，所以注入factory，得到这个方法返回的值my factory
        return ' my factory'
      },
    }
  ]
})

// !局部中间件
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CounterMiddleware).forRoutes('user')
  }
}
