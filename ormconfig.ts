import * as dotenv from 'dotenv';
import * as path from 'path'; // !es6方式引入path
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {User} from './src/user/entities/user.entity'
import {Profile} from './src/user/entities/profile.entity'
import {Logs} from './src/logs/logs.entity'
import {Roles} from './src/roles/roles.entity'
import { DataSource, DataSourceOptions } from 'typeorm';

const envFilePath = `.env.${process.env.NODE_ENV||'development'}`
console.log(envFilePath)
const commonEnvObj = dotenv.config({path: '.env'}).parsed
const currentEnvObj = dotenv.config({path: envFilePath}).parsed
const dotenvObj = {...commonEnvObj, ...currentEnvObj}
console.log(dotenvObj)

export const connectionParams ={
  type: dotenvObj.MYSQL_DB_TYPE,           // 数据库类型
  host: dotenvObj.MYSQL_DB_HOST,       // 数据库的连接地址host
  port: dotenvObj.MYSQL_DB_PORT,              // 数据库的端口 3306
  username: dotenvObj.MYSQL_DB_USERNAME,        // 连接账号
  password: dotenvObj.MYSQL_DB_PASSWORD,     // 连接密码
  database: dotenvObj.MYSQL_DB_DATABASE,     // 连接的表名 // !应该是库名
  retryDelay:500,         // 重试连接数据库间隔
  retryAttempts:10,       // 允许重连次数
  synchronize: Boolean(dotenvObj.MYSQL_DB_SYNC),       // 是否将实体同步到数据库
  //autoLoadEntities:true,  // !自动加载实体配置，将如xx.module.ts里的xx.forFeature([User])注册的每个实体自动加载，添加到配置对象的 entities数组
  //entities: [User,Profile,Roles,Logs], // !手动注册所有实体
  entities: [__dirname + '**/**/*.entity{.ts,.js}'], // !智能获取实体。
  logging: process.env.NODE_ENV === 'development' // !是否打印sql语句日志。
  //"charset": "utf8mb4"
} as TypeOrmModuleOptions

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: []
} as DataSourceOptions)