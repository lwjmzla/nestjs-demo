import { Controller, Get, Post,Req,Request,Query,HttpCode,Header,Redirect ,Bind,Param,Body} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';

interface CreateUserDto{
  name: string;
  age: number;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly appService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): any {
    console.log('user');
    console.log(this.configService.get(ConfigEnum.DB)); // !获取环境变量.env的值，nestjs使用dotenv
    console.log(this.configService.get(ConfigEnum.DB_HOST));
    console.log(this.configService.get(ConfigEnum.DB_URL));
    console.log(this.configService.get('db1'));
    const obj = {
      DB: this.configService.get(ConfigEnum.DB),
      DB_HOST: this.configService.get(ConfigEnum.DB_HOST),
      DB_URL: this.configService.get(ConfigEnum.DB_URL),
      db1: this.configService.get('db1') || '',
    }
    return this.appService.getUser(obj);
  }

  @Get('test')
  getHelloReq(@Query() request): string {
    console.log(request)
    return 'asdsadasd';
  }
  // @Get('*')
  // getHelloReq1(): string {
  //   return 'asdsadasd11';
  // }

  /** 状态码 */
  // 返回状态码 204
  @Post()
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  create_status_code() {
    return {
      name: 'lwj'
    }
  }

  @Get('redirect')
  @Redirect('https://www.baidu.com', 301)
  // 任意方法名 
  redirect(){}

  /*
   * 访问 http://localhost:3000/cats/docs?version=5 跳转到 https://docs.nestjs.com/v5/'
   * 访问 http://localhost:3000/cats/docs 跳转到 https://docs.nestjs.com'
   */
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  /** 路由参数 */
  @Get('param1/:id')
  findOne1(@Param() params): string {
    console.log(params.id);
    return `This action returns a param1 #${params.id} cat`;
  }

  @Get('param2/:id')
  @Bind(Param())
  findOne2(params) {
    console.log(params.id);
    return `This action returns a param2 #${params.id} cat`;
  }

  @Get('param3/:id')
  findOne3(@Param('id') id: string): string {
    return `This action returns a param3 #${id} cat`;
  }

  @Get('param4/:id')
  @Bind(Param('id'))
  findOne4(id) {
    return `This action returns a param4 #${id} cat`;
  }

  @Post('add')
  addHello(@Body() createUserDto: CreateUserDto): any {
    console.log(111,createUserDto.name,createUserDto.age);
    return this.appService.addUser();
  }
}
