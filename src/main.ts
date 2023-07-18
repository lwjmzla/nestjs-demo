import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function MiddleWareAll(req:any,res:any,next:any){
  console.log('我是全局中间件.....')
  next()
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(MiddleWareAll)
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
