import { Injectable } from '@nestjs/common';
import {Like, Repository} from 'typeorm' // !Like模糊查询
import {InjectRepository}from '@nestjs/typeorm'
import {User} from './entities/user.entity'

interface UserDto{
  name: string;
  age: number;
  skill: string;
  id: string;
  entryTime: string;
}

@Injectable()
export class UserService {

  // 依赖注入
  constructor(@InjectRepository(User) private readonly user:Repository<User>){

  }

  getUser(obj): any {
    return {
      code: 200,
      data: obj,
      success: true,
      msg: '请求成功',
    };
  }

  addUser(): any {
    const data = new User()
    // data.name='大睬';
    // data.age=19;
    // data.skill='精油按摩,日式按摩';
    return this.user.save(data);
  }

  // 删除一个女孩
  delUser(id:string){
    return this.user.delete(id)
  }

  updateUser( id: string ){
    const data = new User()
    // data.name="王小丫";
    // data.age=19
    return this.user.update(id,data)
  }

  getUsers({name,age,skill,id}: UserDto):any{
    const opts = {
      where: []
    }
    // !好像where多个无效。
    if (name) {
      opts.where.push({name: Like(`%${name}%`)})
    }
    if (skill) {
      opts.where.push({skill: Like(`%${skill}%`)})
    }
    if (id) {
      opts.where.push({id: Like(`%${id}%`)})
    }
    return this.user.find(opts);
  }

  findAll() {
    return this.user.find();
  }
  find(username: string) {
    return this.user.findOne({
      where: {username}
    })
  }
  async create(user: User) {
    const userTmp = await this.user.create(user)
    return this.user.save(userTmp)
  }
  upadate(id: number, user: Partial<User>) {
    return this.user.update(id,user)
  }
  remove(id: number) {
    return this.user.delete(id)
  }
}
