import { Controller, Get, Post,Req,Request,Inject,Query,HttpCode,Header,Redirect ,Bind,Param,Body} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import {BoyService} from './../boy/boy.service';
import {Users1Service} from '../users1/users1.service'

interface UserDto{
  name: string;
  age: number;
  skill: string;
  id: string;
  entryTime: string;
}

@Controller('user')
export class UserController {
  //private readonly userService: UserService;
  constructor(
    //readonly userService: UserService, // !相当于上面和下面注释的两行，private readonly userService: UserService;   this.userService = new UserService()
    @Inject('user') readonly userService: UserService,
    @Inject('userArr') readonly userArr: string[],
    @Inject('factory') readonly myFactory: string,
    private configService: ConfigService,
    private boyService:BoyService,
    private user1Service:Users1Service
  ) {
    //this.userService = new UserService()
  }

  @Get()
  getHello(): any {
    console.log('user');
    // console.log(this.configService.get(ConfigEnum.DB)); // !获取环境变量.env的值，nestjs使用dotenv
    // console.log(this.configService.get(ConfigEnum.DB_HOST));
    // console.log(this.configService.get(ConfigEnum.DB_URL));
    // console.log(this.configService.get('db1'));
    const obj = {
      // DB: this.configService.get(ConfigEnum.DB),
      // DB_HOST: this.configService.get(ConfigEnum.DB_HOST),
      // DB_URL: this.configService.get(ConfigEnum.DB_URL),
      // db1: this.configService.get('db1') || '',
    }
    return this.userService.getUser(obj);
  }

  @Get('test')
  getHelloReq(@Query() request): any {
    console.log(request)
    return this.userArr.join(',') + this.myFactory + this.boyService.findAll() + this.user1Service.findAll();
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
  addUser(@Body() userDto: UserDto): any {
    console.log(userDto);
    return this.userService.addUser();
  }

  @Post('delete')
  delUser(@Body() params: {id: string}): any {
    console.log(params);
    return this.userService.delUser(params.id);
  }

  @Post('update')
  updateUser(@Body() params: {id: string}): any {
    console.log(params);
    return this.userService.updateUser(params.id);
  }

  @Get('queryPage')
  getUsersByGet(): any {
    return this.userService.getUsers({} as any);
  }

  @Post('queryPage')
  getUsers(@Body() params: UserDto): any {
    console.log(params);
    return this.userService.getUsers(params);
  }
}
