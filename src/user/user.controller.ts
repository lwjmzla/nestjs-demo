import { Controller, Get, Post, Req, Request, Inject, Query, HttpCode, Header, Redirect, Bind, Param, Body, Logger, HttpException, HttpStatus, NotFoundException, UnauthorizedException, LoggerService} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import {BoyService} from './../boy/boy.service';
import {Users1Service} from '../users1/users1.service'
import { User } from './entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto';

interface UserDto{
  name: string;
  age: number;
  skill: string;
  id: string;
  entryTime: string;
}

@Controller('user')
export class UserController {
  //private logger = new Logger(UserController.name)
  //private readonly userService: UserService;
  constructor(
    //readonly userService: UserService, // !相当于上面和下面注释的两行，private readonly userService: UserService;   this.userService = new UserService()
    @Inject('user') readonly userService: UserService,
    @Inject('userArr') readonly userArr: string[],
    @Inject('factory') readonly myFactory: string,
    private configService: ConfigService,
    private boyService:BoyService,
    private user1Service:Users1Service,
    //private logger: Logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    //this.userService = new UserService()
    this.logger.log('UserController init')
  }

  @Get()
  getUsers(@Query() query: getUserDto): any {
    console.log(query);
    const regNum = /^[0-9]+$/
    for (const key in query) {
      if (regNum.test(query[key])) {
        query[key] = parseInt(query[key])
      }
    }
    console.log(query);
    return this.userService.findAll(query);
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
    const user = {
      username: 'lwj',
      password: '123456'
    } as User
    return this.userService.create(user);
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
    //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); // {"statusCode":403,"message":"Forbidden"}
    //throw new NotFoundException('NotFoundException');
    //throw new UnauthorizedException('UnauthorizedException');
    this.logger.log('UserController queryPage')
    this.logger.warn('UserController queryPage')
    this.logger.error('UserController queryPage')
    return {};
  }

  @Post('queryPage')
  getUsers1(@Body() params: UserDto): any {
    console.log(params);
    return this.userService.getUsers(params);
  }

  @Get('profile')
  getProfile(): any {
    return this.userService.findProfile(2);
  }

  @Get('logsById')
  getLogsById(): any {
    return this.userService.findLogs(2);
  }

  @Get('logs')
  getLogs(): any {
    return this.userService.queryLogs();
  }
}
