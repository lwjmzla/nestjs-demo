import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser(): any {
    return {
      code: 200,
      data: 'lwj122',
      success: true,
      msg: '请求成功',
    };
  }

  addUser(): any {
    return {
      code: 200,
      data: {},
      success: true,
      msg: '添加成功1',
    };
  }
}
