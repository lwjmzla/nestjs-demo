import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
//import * as path from 'path'; // !es6方式引入path
//const envFilePath = path.join(__dirname, `../.env.${process.env.NODE_ENV||'development'}`) // !或者直接传文件名，.env.development
const envFilePath = `.env.${process.env.NODE_ENV||'development'}`
console.log(envFilePath)

//import LoadConfigFn from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config({path: '.env'})], // !公共的环境变量  其实load最灵活，只需要满足 [() => ({key:val...})]的形式,使用this.configService.get(key)
      envFilePath, // ! 对应的dev或者prod环境变量
      //load: [LoadConfigFn]
    }),
    UserModule,
  ], // !nest g module user 自动创建并引入了
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
