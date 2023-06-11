import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // !上面其实是个语法糖，相当于this.appService = new AppService()
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('name') // !这里的getHello1 好像可以随便写的
  getHello1(): any {
    return {
      code: 200,
      data: 'lwj',
      success: true,
      msg: '请求成功',
    };
  }

  @Get('range')
  getHello2(e): any {
    console.log(e, 123);
    return {
      code: 200,
      data: 'range',
      success: true,
      msg: '请求成功',
    };
  }
}
