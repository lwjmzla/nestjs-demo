import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated, OneToMany, JoinColumn, ManyToMany, JoinTable,OneToOne} from 'typeorm'
import { Logs } from '../../logs/logs.entity';
import { Roles } from '../../roles/roles.entity';
import { Profile } from './profile.entity';

@Entity()
export class User{
  
  // @PrimaryGeneratedColumn("uuid") // !id为自增的列
  // id:string

  // @Column({type:"varchar",length:255})
  // name:string

  // @Column({type:"int"})
  // age:number

  // @Column({type:"varchar"})
  // skill:string

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date

  @OneToMany(() => Logs, (logs) => logs.user) // !一对多 和logs.entity.ts的多对一 是一pair的
  // @JoinColumn() // !这里不需要
  logs: Logs[]

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({name: 'user_roles'}) // !多对多 生成关系表
  roles: Roles[]

  @OneToOne(() => Profile, (profile) => profile.user) // !一对一
  //@JoinColumn() // !创建userId，可以传参{name: 'lwjid'} 改变字段名
  profile: Profile;

  // @Generated('uuid')
  // uuid:string
}