import { Global, Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Users1Module } from './users1/users1.module'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { BoyModule } from './boy/boy.module';
import * as dotenv from 'dotenv';
import * as path from 'path'; // !es6方式引入path
//const envFilePath = path.join(__dirname, `../.env.${process.env.NODE_ENV||'development'}`) // !或者直接传文件名，.env.development
const envFilePath = `.env.${process.env.NODE_ENV||'development'}`
console.log(envFilePath)
const commonEnvObj = dotenv.config({path: '.env'}).parsed
const currentEnvObj = dotenv.config({path: envFilePath}).parsed
const dotenvObj = {...commonEnvObj, ...currentEnvObj}
console.log(dotenvObj)
import {Users1Service} from './users1/users1.service'
import {User} from './user/entities/user.entity'
import {Profile} from './user/entities/profile.entity'
import {Logs} from './logs/logs.entity'
import {Roles} from './roles/roles.entity'
import { LogsModule } from './logs/logs.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/http-exception.filter';

//import LoadConfigFn from './config' // !yml 配置文件方式

const mysqlConf = {
  type: dotenvObj.MYSQL_DB_TYPE,           // 数据库类型
  host: dotenvObj.MYSQL_DB_HOST,       // 数据库的连接地址host
  port: dotenvObj.MYSQL_DB_PORT,              // 数据库的端口 3306
  username: dotenvObj.MYSQL_DB_USERNAME,        // 连接账号
  password: dotenvObj.MYSQL_DB_PASSWORD,     // 连接密码
  database: dotenvObj.MYSQL_DB_DATABASE,     // 连接的表名 // !应该是库名
  retryDelay:500,         // 重试连接数据库间隔
  retryAttempts:10,       // 允许重连次数
  synchronize: Boolean(dotenvObj.MYSQL_DB_SYNC),       // 是否将实体同步到数据库
  autoLoadEntities:true,  // 自动加载实体配置，forFeature()注册的每个实体都自己动加载
  //"charset": "utf8mb4"
} as TypeOrmModuleOptions

// const mysqlConf = {
//   type:'mysql',           // 数据库类型
//   host:'127.0.0.1',       // 数据库的连接地址host
//   port:3306,              // 数据库的端口 3306
//   username:'root',        // 连接账号
//   password:'root123',     // 连接密码
//   database:'nestjs_demo',     // 连接的表名 // !应该是库名
//   retryDelay:500,         // 重试连接数据库间隔
//   retryAttempts:10,       // 允许重连次数
//   synchronize:true,       // 是否将实体同步到数据库
//   autoLoadEntities:true,  // 自动加载实体配置，forFeature()注册的每个实体都自己动加载
//   //"charset": "utf8mb4"
// }

// if (process.env.NODE_ENV === 'production') {
//   mysqlConf.host = '119.29.170.43'
//   mysqlConf.port = 3305
//   mysqlConf.password = '123'
// }

//@Global() // !exports: [Logger]
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config({path: '.env'})], // !公共的环境变量  其实load最灵活，只需要满足 [() => ({key:val...})]的形式,使用this.configService.get(key)
      envFilePath, // ! 对应的dev或者prod环境变量
      //load: [LoadConfigFn]
    }),
    //TypeOrmModule.forRoot(mysqlConf), // !环境变量同步的方式连接mysql
    TypeOrmModule.forRootAsync({ // !环境变量异步的方式连接mysql
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: configService.get('MYSQL_DB_TYPE'),           // 数据库类型
          host: configService.get('MYSQL_DB_HOST'),       // 数据库的连接地址host
          port: configService.get('MYSQL_DB_PORT'),              // 数据库的端口 3306
          username: configService.get('MYSQL_DB_USERNAME'),        // 连接账号
          password: configService.get('MYSQL_DB_PASSWORD'),     // 连接密码
          database: configService.get('MYSQL_DB_DATABASE'),     // 连接的表名 // !应该是库名
          retryDelay:500,         // 重试连接数据库间隔
          retryAttempts:10,       // 允许重连次数
          synchronize: Boolean(configService.get('MYSQL_DB_SYNC')),       // 是否将实体同步到数据库
          //autoLoadEntities:true,  // !自动加载实体配置，将如xx.module.ts里的xx.forFeature([User])注册的每个实体自动加载，添加到配置对象的 entities数组
          //entities: [path.join(__dirname, '../', '**/**.entity{.ts,.js}')], // !报错，Cannot use import statement outside a module
          entities: [User,Profile,Roles,Logs], // !手动注册所有实体
          logging: process.env.NODE_ENV === 'development'
          //"charset": "utf8mb4"
        } as TypeOrmModuleOptions
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const host = '119.29.170.43'
        const port = 27016
        const database = configService.get('MYSQL_DB_DATABASE')
        return {
          uri: `mongodb://${host}:${port}/${database}`,
          retryDelay:500,         // 重试连接数据库间隔
          retryAttempts:10,       // 允许重连次数
        } as MongooseModuleOptions
      },
    }),
    UserModule,
    Users1Module,
    BoyModule,
    LogsModule
  ], // !nest g module user 自动创建并引入了
  controllers: [AppController],
  providers: [
    AppService,
    Users1Service,
    //Logger, // !已经在 main.ts  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    {
      provide: APP_FILTER, //!全局过滤器，不需要在 main.ts app.useGlobalFilters(new AllExceptionsFilter(logger,httpAdapterHost));
      useClass: AllExceptionsFilter,
    },
  ],
  //exports: [Logger] // !已经在 main.ts  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
})
export class AppModule {}
