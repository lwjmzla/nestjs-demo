import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

function MiddleWareAll(req:any,res:any,next:any){
  console.log('我是全局中间件.....')
  next()
}

async function bootstrap() {
  const logger = new Logger('模块名LWJ')
  const app = await NestFactory.create(AppModule, {
    //logger: false // !关闭日志
    //logger: ['error' , 'warn']
  });
  app.use(MiddleWareAll)
  app.setGlobalPrefix('api');
  const port = 3000
  await app.listen(port);
  logger.log(`app运行在 ${port} 端口`)
  logger.warn(`app运行在 ${port} 端口`)
  logger.error(`app运行在 ${port} 端口`)
}
bootstrap();
