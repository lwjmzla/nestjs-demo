import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import { WinstonModule, utilities, WINSTON_MODULE_NEST_PROVIDER  } from 'nest-winston';
import * as winston from 'winston';
import { Logger, UnauthorizedException, ValidationPipe } from '@nestjs/common';
// import 'winston-daily-rotate-file'
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';

// !就是express的中间件
function MiddleWareAll(req:Request, res:Response, next:NextFunction){
  //console.log(req.headers)
  console.log('我是全局中间件.....')
  // if (!req.headers.usertoken) {
  //   throw new UnauthorizedException('请登录')
  // }
  next()
}

async function bootstrap() {
  //const logger = new Logger('模块名LWJ')
  // const instance = createLogger({
  //   // options of Winston
  //   transports: [
  //     new winston.transports.Console({
  //       format: winston.format.combine(winston.format.timestamp(), utilities.format.nestLike()),
  //     }),
  //     // 保存到文件
  //     new winston.transports.DailyRotateFile({
  //       // 日志文件文件夹，建议使用path.join()方式来处理，或者process.cwd()来设置，此处仅作示范
  //       dirname: 'logs',
  //       // 日志文件名 %DATE% 会自动设置为当前日期
  //       filename: 'info-%DATE%.log',
  //       // 日期格式
  //       datePattern: 'YYYY-MM-DD-HH',
  //       // 压缩文档，用于定义是否对存档的日志文件进行 gzip 压缩 默认值 false
  //       zippedArchive: true,
  //       // 文件最大大小，可以是bytes、kb、mb、gb
  //       maxSize: '20m',
  //       // 最大文件数，可以是文件数也可以是天数，天数加单位"d"，
  //       maxFiles: '7d',
  //       // 格式定义，同winston
  //       format: winston.format.combine(
  //         winston.format.timestamp({
  //           format: 'YYYY-MM-DD HH:mm:ss',
  //         }),
  //         winston.format.json(),
  //       ),
  //       // 日志等级，不设置所有日志将在同一个文件
  //       level: 'info',
  //     }),
  //     // 同上述方法，区分error日志和info日志，保存在不同文件，方便问题排查
  //     new winston.transports.DailyRotateFile({
  //       dirname: 'logs',
  //       filename: 'error-%DATE%.log',
  //       datePattern: 'YYYY-MM-DD-HH',
  //       zippedArchive: true,
  //       maxSize: '20m',
  //       maxFiles: '14d',
  //       format: winston.format.combine(
  //         winston.format.timestamp({
  //           format: 'YYYY-MM-DD HH:mm:ss',
  //         }),
  //         winston.format.json(),
  //       ),
  //       level: 'error',
  //     }),
  //   ]
  // });
  
  // const logger = WinstonModule.createLogger({
  //   instance,
  // })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    //logger: false // !关闭日志
    //logger: ['error' , 'warn']
    //logger,
  });
  app.use(MiddleWareAll)
  app.setGlobalPrefix('api');
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  //const httpAdapterHost = app.get(HttpAdapterHost);
  //app.useGlobalFilters(new AllExceptionsFilter(logger,httpAdapterHost));
  // app.useGlobalPipes(new ValidationPipe({
  //   // whitelist: true // !去除在类上不存在的字段。
  // }));
  const port = 3000
  await app.listen(port, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`); // !全局注册后的logger，也是Winston类型
  // logger.log(`app运行在 ${port} 端口`)
  // logger.warn(`app运行在 ${port} 端口`)
  // logger.error(`app运行在 ${port} 端口`)
}
bootstrap();
