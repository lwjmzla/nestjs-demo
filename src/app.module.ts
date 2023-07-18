import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Users1Module } from './users1/users1.module'
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoyModule } from './boy/boy.module';
import * as dotenv from 'dotenv';
//import * as path from 'path'; // !es6方式引入path
//const envFilePath = path.join(__dirname, `../.env.${process.env.NODE_ENV||'development'}`) // !或者直接传文件名，.env.development
const envFilePath = `.env.${process.env.NODE_ENV||'development'}`
console.log(envFilePath)

//import LoadConfigFn from './config' // !yml 配置文件方式

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config({path: '.env'})], // !公共的环境变量  其实load最灵活，只需要满足 [() => ({key:val...})]的形式,使用this.configService.get(key)
      envFilePath, // ! 对应的dev或者prod环境变量
      //load: [LoadConfigFn]
    }),
    TypeOrmModule.forRoot({
      type:'mysql',           // 数据库类型
      host:'localhost',       // 数据库的连接地址host
      port:3306,              // 数据库的端口 3306
      username:'root',        // 连接账号
      password:'root123',     // 连接密码
      database:'test_db1',     // 连接的表名 // !应该是库名
      retryDelay:500,         // 重试连接数据库间隔
      retryAttempts:10,       // 允许重连次数
      synchronize:true,       // 是否将实体同步到数据库
      autoLoadEntities:true,  // 自动加载实体配置，forFeature()注册的每个实体都自己动加载
    }),
    UserModule,
    Users1Module,
    BoyModule
  ], // !nest g module user 自动创建并引入了
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
