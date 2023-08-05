import { ArgumentsHost, Catch, ExceptionFilter, Inject, LoggerService } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(TypeORMError) // !只捕捉TypeORMError
export class TypeormFilter<T> implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost, // ! 这个已经全局注入了，就像logger 在 main.ts  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}
  catch(exception: TypeORMError, host: ArgumentsHost) {
    //console.log(this.httpAdapterHost)
    const ctx = host.switchToHttp();
    const request = ctx.getRequest()
    const response = ctx.getResponse()
    let code = 500
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno
    }
    const responseBody= {
      code,
      timestamp: new Date().toISOString(),
      message: exception.message
    }
    this.logger.error('[TypeORMErrorExceptionsFilter]', responseBody)
    response.status(500).json(responseBody)
  }
}
