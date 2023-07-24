import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated, ManyToMany, JoinTable} from 'typeorm'
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Roles{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date

  @ManyToMany(() => User, (user) => user.roles)
  //@JoinTable({name: 'roles_users'})
  users: User[]

}