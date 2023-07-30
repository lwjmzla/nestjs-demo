import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated, ManyToOne, JoinColumn} from 'typeorm'
import { User } from '../user/entities/user.entity';

@Entity()
export class Logs{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  result: number;

  @CreateDateColumn({type:"timestamp"}) // !键入时间
  entryTime:Date

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn()
  user: User;
}