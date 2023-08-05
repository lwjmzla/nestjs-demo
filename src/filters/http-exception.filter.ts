import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost, // ! 这个已经全局注入了，就像logger 在 main.ts  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    //console.log(host)
    //console.log(httpAdapter) // !HTTP 适配器：ExpressAdapter 或 FastifyAdapter   const instance = httpAdapter.getInstance();

    const ctx = host.switchToHttp();
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // !可以细化过滤信息
    let msg = exception['reponse'] || 'Internal Server Error'
    if (exception instanceof QueryFailedError) {
      msg =exception.message
      // if (exception.driverError.errno && exception.driverError.errno === 1062) {
      //   msg = '唯一索引冲突'
      // }
    }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      path: httpAdapter.getRequestUrl(request),
      exception: exception['name'],
      error: exception['reponse'] || 'Internal Server Error',
      hostname: httpAdapter.getRequestHostname(request),
      message: exception instanceof HttpException ? (exception.getResponse() as HttpException).message : [(exception as Error).message.toString()],
      msg,
      method: httpAdapter.getRequestMethod(request),
      stackTrace: exception instanceof HttpException ? '' : (exception as Error).stack
    };

    this.logger.error('[AllExceptionsFilter]', responseBody)
    // !responseBody 打印出来没问题，但返回给用户的时候要精简参数
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}