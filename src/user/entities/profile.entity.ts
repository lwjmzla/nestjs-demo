import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated, OneToOne, JoinColumn} from 'typeorm'
import { User } from './user.entity';

@Entity()
export class Profile{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date;
  
  @OneToOne(() => User) // !一对一
  @JoinColumn() // !创建userId，可以传参{name: 'lwjid'} 改变字段名
  user: User;
}