import { NestModule, MiddlewareConsumer, Module, RequestMethod, Global } from '@nestjs/common';
import { Users1Service } from './users1.service';
import { Users1Controller } from './users1.controller';
import { CounterMiddleware } from '../counter/counter.middleware'
import { UserModule } from 'src/user/user.module';

@Global() // !全局模块
@Module({
  //imports: [UserModule],
  controllers: [Users1Controller],
  providers: [Users1Service],
  exports: [Users1Service],
})
export class Users1Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CounterMiddleware).forRoutes({ path: 'users1', method: RequestMethod.GET });
  }
}

