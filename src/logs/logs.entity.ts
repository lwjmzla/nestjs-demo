import {Entity , Column ,PrimaryGeneratedColumn, CreateDateColumn, Generated} from 'typeorm'

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

}