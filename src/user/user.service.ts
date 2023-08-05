import { Injectable } from '@nestjs/common';
import { FindManyOptions, Like, Repository } from 'typeorm' // !Like模糊查询
import { InjectRepository }from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Logs } from 'src/logs/logs.entity';
import { getUserDto } from './dto';

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
  constructor(
    @InjectRepository(User) private readonly user:Repository<User>,
    @InjectRepository(Logs) private readonly log:Repository<Logs>
  ){

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

  getUsers({ name, age, skill, id }: UserDto):any{
    const opts = {
      where: []
    }
    // !好像where多个无效。
    if (name) {
      opts.where.push({ name: Like(`%${name}%`) })
    }
    if (skill) {
      opts.where.push({ skill: Like(`%${skill}%`) })
    }
    if (id) {
      opts.where.push({ id: Like(`%${id}%`) })
    }
    return this.user.find(opts);
  }

  findAll(query: getUserDto) {
    const { page = 1, limit = 10, username, role, gender } = query
    const take = limit
    const skip = (page - 1) * take
    const findOpts = {
      select: { // !选择要展示的字段，password不被显示
        id: true,
        username: true,
        entryTime: true,
        profile: {
          id: true,
          gender: true,
          photo: true,
          address: true
        }
      },
      order: {
        entryTime: "DESC"
      },
      relations: {
        profile: true,
        roles: true
      },
      where: {
        //username, // !user自己的字段
        // profile: {
        //   gender
        // },
        // roles: {
        //   id: role
        // }
      },
      take,
      skip
    } as FindManyOptions<User>
    if (username) {
      findOpts.where['username'] = Like(`%${username}%`)
    }
    if (gender) {
      findOpts.where['profile'] = { gender }
    }
    if (role) {
      findOpts.where['roles'] = { id: role }
    }
    return this.user.find(findOpts);
  }
  find(username: string) {
    return this.user.findOne({
      where: { username }
    })
  }
  async create(user: User) {
    const userTmp = await this.user.create(user)
    return this.user.save(userTmp)
  }
  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findProfile(id)
    console.log(userTemp) // !userTemp 和 user 结构一致的级联关系
    const newUser = this.user.merge(userTemp, user) // !实体那里还要添加{ cascade: true }
    return this.user.save(newUser) // !联合模型更新,需要使用save方法或者queryBuilder
    //return this.user.update(id, user) // !只适合单模型的更新~
  }
  async remove(id: number) {
    //return this.user.delete(id) // !硬删除
    const user = await this.user.findOne({
      where: { id }
    })
    return this.user.remove(user) // !触发 AfterRemove钩子
  }

  findProfile(id: number) {
    return this.user.findOne({
      where: { id },
      relations: {
        profile: true
      }
    })
  }

  findLogs(id: number) {
    return this.user.findOne({
      where: { id },
      relations: {
        // profile: true, // !还可以连一起
        logs: true
      }
    })
  }

  queryLogs() {
    return this.log.find({
      where: { result: 200, method: 'get', path: Like(`%asd%`) },
    })
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as result, COUNT(logs.result) AS count FROM logs, user WHERE logs.user_id= logs.userId AND user.id= 2 GROUP BY logs.result;
    // return this.log.query("select* from logs") // !直接用mysql方式
    // !QueryBuilder方式   -----  我其实只想用find方式
    return this.log
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id= :id', { id })
      .groupBy('logs.result')
      .orderBy('count', 'DESC')
      .addOrderBy('result', 'DESC')
      .offset(2)
      .limit(3)
      .getRawMany();
  }
}
