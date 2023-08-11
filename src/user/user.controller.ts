import { Controller, Get, Post, Req, Inject, Query, HttpCode, Header, Headers, Redirect, Bind, Param, Body, Logger, HttpException, HttpStatus, NotFoundException, UnauthorizedException, LoggerService, UseFilters, ParseIntPipe, DefaultValuePipe, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { BoyService } from './../boy/boy.service';
import { Users1Service } from '../users1/users1.service'
import { User } from './entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GetUserDto } from './dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { Profile } from './entities/profile.entity';
import { TypeORMError } from 'typeorm';
import { GetUserPipe } from './pipes/index.pipe';
import { ParseIntPipeCustom } from './pipes/parse.int.pipe';
import { AuthGuard } from '@nestjs/passport';
import type { NextFunction, Request, Response } from 'express';

interface UserDto{
  name: string;
  age: number;
  skill: string;
  id: string;
  entryTime: string;
}

@Controller('user')
//@UseFilters(new TypeormFilter()) // !局部filter，这种方式构造函数的参数要传参
@UseFilters(TypeormFilter) // !局部filter，这种方式构造函数的参数只需要inject，   // !可以针对Controller和路由控制
export class UserController {
  //private logger = new Logger(UserController.name)
  //private readonly userService: UserService;
  constructor(
    readonly userService: UserService, // !相当于上面和下面注释的两行，private readonly userService: UserService;   this.userService = new UserService()
    //@Inject('user') readonly userService: UserService,
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

  @Get() // !PipeTransform
  getUsers(@Query(GetUserPipe) query: GetUserDto): any {
    console.log('getUsers', query);
    return this.userService.findAll(query);
  }

  @Get('getAll')
  getAllUsers(
    @Query('page', ParseIntPipeCustom) page: number, // !ParseIntPipeCustom 比ParseIntPipe好太多了,ParseIntPipe没值的时候会报错
    //@Query('limit', ParseIntPipeCustom) limit: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    // @Query('limit', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) limit: number, // !改变Exception类型
    //@Query('limit', new DefaultValuePipe(10), ParseIntPipeCustom) limit: number,
    @Query('username') username: string,
    @Query('role', ParseIntPipeCustom) role: number,
    @Query('gender', ParseIntPipeCustom) gender: number,
    @Headers('userToken') userToken: any
  ): any {
    console.log(userToken)
    const query = { page, limit, username, role, gender }
    console.log('getAll', query)
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
  @Get('param1/:id') // !简单的Pipe
  findOne1(@Param('id', ParseIntPipe) id): string {
    console.log(id);
    return `This action returns a param1 #${id} cat`;
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
  // @UseFilters(TypeormFilter) // !可以针对路由控制
  addUser(@Body() userDto: User): any {
    console.log(userDto);
    return this.userService.create(userDto);
  }

  @Post('delUser')
  delUser(@Body() params: {id: number}): any {
    console.log(params);
    return this.userService.remove(params.id);
  }

  @Post('updateUser')
  updateUser(@Body() params: {id: number} & User & Profile, @Headers('Authorization') authorization: any): any {
    console.log(authorization)
    // !鉴权
    if (authorization === 'Bearer') {
      console.log(params);
      const { id, username, password, gender, photo, address } = params
      delete params.id
      const userInfo = { // !其实前端传参的时候按下面格式传，后端就不用转换一层了，所以定义好。
        username,
        password,
        profile: {
          gender,
          photo,
          address
        }
      } as User
      console.log(userInfo)
      return this.userService.update(id, userInfo);
    } else {
      throw new UnauthorizedException()
      //throw new TypeORMError()
    }
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
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Query('id', ParseIntPipe) id: number, @Req() req): any {
    console.log(req.user)
    return this.userService.findProfile(id);
  }

  @Get('logsById')
  getLogsById(): any {
    return this.userService.findLogs(2);
  }

  @Get('logs')
  getLogs(): any {
    return this.userService.queryLogs();
  }

  @Post('userPage')
  userPage(@Body() body) {
    return this.userService.userPage(body);
  }

  @Post('page')
  recordPage(@Res() response: Response) {
    return response.status(503).send('asdasd')
  }
}
