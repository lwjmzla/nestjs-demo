import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm'
//import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity'
//import {Profile} from './entities/profile.entity'
import { Logs } from 'src/logs/logs.entity';
import { CounterMiddleware } from '../counter/counter.middleware'
import { BoyService } from '../boy/boy.service';
import { HttpModule } from '@nestjs/axios';

@Global() // !设为全局，方便各Injectable模块直接使用userService: UserService
@Module({
  //imports: [ConfigModule.forRoot()], // !这种方式，要求每个使用到的module都要引入，麻烦，所以采用全局的
  imports:[HttpModule, TypeOrmModule.forFeature([User, Logs])], // !user.service.ts 注入的实体，需要先在这里引入。
  controllers: [UserController],
  //providers: [UserService], // !把UserService里的功能注入到UserController
  providers: [
    BoyService, // !这种方式引入供给user.controller.ts、.user.service.ts使用，BoyService没啥依赖还好，有其他依赖的话需要一并引入，很麻烦！！！
    UserService,
    // {
    //   provide: 'user',
    //   useClass: UserService
    // },
    {
      provide: 'userArr',
      useValue: ['lwj', 'lwb', 'lwz']
    },
    {
      provide: 'factory',
      useFactory() { // !运行程序时，就会执行useFactory这个方法，所以注入factory，得到这个方法返回的值my factory
        return ' my factory'
      },
    }
  ],
  exports: [UserService]
})

// !局部中间件
export class UserModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(CounterMiddleware).forRoutes('user') // !针对user路由启用
    consumer.apply(CounterMiddleware).forRoutes({ path: 'user*', method: RequestMethod.GET }) // !还可以排除路由，exclude({ path: 'cats', method: RequestMethod.GET },...)
    //consumer.apply(CounterMiddleware).forRoutes(UserController) // !多个controller  forRoutes(UserController,xxxx)
  }
}
